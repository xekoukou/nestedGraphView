#include"positiondb.h"
#include"quadtrie-c/quadbit.h"
#include<stdio.h>
#include<czmq.h>
#include<jansson.h>

json_t *search(quadbit_t * quadbit, json_t * request)
{
	quadbit_print(quadbit);
	json_t *response = json_object();
	json_t *node_array = json_array();
	json_t *json_searchArray = json_object_get(request, "searchArray");

	int i;
	for (i = 0; i < json_array_size(json_searchArray); i++) {
		json_t *set = json_array_get(json_searchArray, i);

		quadbit_item_t search;
		search.x = json_integer_value(json_object_get(set, "posX"));
		search.y = json_integer_value(json_object_get(set, "posY"));
		uint8_t crit_pos =
		    json_integer_value(json_object_get(set, "crit_pos"));
		quadbit_node_t *res_parent = NULL;
		pos_id_t
		    * res_item =
		    (pos_id_t *) quadbit_search_set(quadbit,
						    &search, &res_parent,
						    crit_pos);
		if (res_parent) {
			quadbit_iter_t qiter;
			res_item =
			    (pos_id_t *) quadbit_iter_first(&qiter, res_parent);
			while (res_item) {

				json_t *node = json_object();
				json_object_set_new(node, "posX",
						    json_integer(res_item->x));
				json_object_set_new(node, "posY",
						    json_integer(res_item->y));
				json_object_set_new(node, "id",
						    json_integer(res_item->id));
				json_object_set_new(node, "ancestorId",
						    json_integer
						    (res_item->ancestorId));
				json_array_append_new(node_array, node);

				res_item =
				    (pos_id_t *) quadbit_iter_next(&qiter);
			}

		} else {
			if (res_item) {

				json_t *node = json_object();
				json_object_set_new(node, "posX",
						    json_integer(res_item->x));
				json_object_set_new(node, "posY",
						    json_integer(res_item->y));
				json_object_set_new(node, "id",
						    json_integer(res_item->id));
				json_object_set_new(node, "ancestorId",
						    json_integer
						    (res_item->ancestorId));
				json_array_append_new(node_array, node);
			}
		}
	}
	json_object_set_new(response, "nodeArray", node_array);
	json_object_set_new(response, "type", json_string("searchResponse"));

	return response;

}

json_t *insert(positiondb_t * positiondb, quadbit_t * quadbit, json_t * json)
{

	json_t *json_data = json_object_get(json, "node");

	pos_id_t *item = malloc(sizeof(pos_id_t));
	item->x = json_integer_value(json_object_get(json_data, "posX"));
	item->y = json_integer_value(json_object_get(json_data, "posY"));
	item->id = json_integer_value(json_object_get(json_data, "id"));
	item->ancestorId =
	    json_integer_value(json_object_get(json_data, "ancestorId"));

//do not accept a new node with the same location
	if (quadbit_search(quadbit, (quadbit_item_t *) item)) {

		json_t *response = json_object();
		json_object_set_new(response, "type",
				    json_string("newNodeResponse"));
		json_object_set_new(response, "ack", json_string("failed"));
		return response;
	}
	positiondb_insert_pos_id(positiondb, item);
	quadbit_insert(quadbit, (quadbit_item_t *) item);
//TODO remove this
	printf("INSERT\n");
	quadbit_print(quadbit);

	json_t *response = json_object();
	json_object_set_new(response, "type", json_string("newNodeResponse"));
	json_object_set_new(response, "ack", json_string("ok"));
	return response;

}

json_t *newPosition(positiondb_t * positiondb, quadbit_t * quadbit,
		    json_t * json)
{
	pos_id_t *item = malloc(sizeof(pos_id_t));
	item->x = json_integer_value(json_object_get(json, "posX"));
	item->y = json_integer_value(json_object_get(json, "posY"));
	item->id = json_integer_value(json_object_get(json, "id"));
	item->ancestorId =
	    json_integer_value(json_object_get(json, "ancestorId"));

//delete the previous position
	pos_id_t prev_pos_id;
	positiondb_get_pos_id(positiondb, item->id, &prev_pos_id);

//TODO remove this
	printf("DELETED ITEM ");
	print_item((quadbit_item_t *) & prev_pos_id);
	printf("BEFORE DELETION\n");
	quadbit_print(quadbit);

	pos_id_t *deleted = (pos_id_t *) quadbit_remove(quadbit,
							(quadbit_item_t *)
							& prev_pos_id);
//TODO remove this
	printf("DELETION\n");
	quadbit_print(quadbit);

//this is in case the cliend sends an id that doesn't exist
	if (deleted) {
		free(deleted);

//it updates the values
		positiondb_insert_pos_id(positiondb, item);
		quadbit_insert(quadbit, (quadbit_item_t *) item);
	}
//TODO remove this
	printf("INSERT AFTER DELETION\n");
	quadbit_print(quadbit);

	return NULL;

}

json_t *delete(positiondb_t * positiondb, quadbit_t * quadbit, json_t * json)
{
	pos_id_t item;
	int64_t id = json_integer_value(json_object_get(json, "id"));
	positiondb_get_pos_id(positiondb, id, &item);

	free(quadbit_remove(quadbit, (quadbit_item_t *) & item));

	positiondb_delete_pos_id(positiondb, item.id);

	json_t *response = json_object();
	json_object_set_new(response, "type", json_string("delNode"));
	json_object_set_new(response, "ack", json_string("ok"));
	return response;

}

int main(int argc, char *argv[])
{

	if (argc != 3) {
		printf
		    ("\nPlease provide the ip address and the port for the server to connect");
		exit(1);
	}
	//create the server sockets
	zctx_t *ctx = zctx_new();
	void *router = zsocket_new(ctx, ZMQ_ROUTER);
	int port = atoi(argv[2]);
	int rc = zsocket_connect(router, "tcp://%s:%d", argv[1], port);
	if (rc != 0) {
		printf("The position_server could't connect to %s:%d", argv[1],
		       port);
		exit(-1);
	}
	//init the database
	positiondb_t *positiondb;
	positiondb_init(&positiondb);

	//init the quadtrie
	quadbit_t *quadbit;
	quadbit_init(&quadbit);

	//load the nodes

	leveldb_iterator_t
	    * iter =
	    leveldb_create_iterator(positiondb->db, positiondb->readoptions);

	pos_id_t *pos_id = positiondb_first(iter);
	while (pos_id) {
		quadbit_insert(quadbit, (quadbit_item_t *) pos_id);
		pos_id = positiondb_next(iter);
	}

	//main loop

	while (1) {
		zmsg_t *msg = zmsg_recv(router);
		zframe_t *address = zmsg_unwrap(msg);

		printf("\nposition server received: %s\n",
		       (const char *)zframe_data(zmsg_first(msg)));

		const char *data;
		size_t data_size = zframe_size(zmsg_first(msg));
		data = zframe_data(zmsg_first(msg));
		json_t *request_json;
		json_error_t error;
		request_json = json_loadb(data, data_size, 0, &error);
		zmsg_destroy(&msg);

		json_t *response;

		json_t *request = json_object_get(request_json, "request");
		const char *type =
		    json_string_value(json_object_get(request, "type"));

		if (strcmp(type, "searchRequest") == 0) {

			response = search(quadbit, request);
		} else {

			if (strcmp(type, "newNodeRequest") == 0) {

				response = insert(positiondb, quadbit, request);

			} else {
				if (strcmp(type, "newPosition") == 0) {
					response =
					    newPosition(positiondb,
							quadbit, request);

				} else {
					if (strcmp(type, "delNode") == 0) {
						response =
						    delete(positiondb,
							   quadbit, request);

					} else {
//TODO Do the remaining requests
					}
				}
			}
		}
		if (response) {
			json_t *response_json = json_object();

			json_object_set(response_json, "requestId",
					json_object_get
					(request_json, "requestId"));
			json_object_set_new(response_json, "response",
					    response);

			zmsg_t *resp_msg = zmsg_new();
			char *res_json_str =
			    json_dumps(response_json, JSON_COMPACT);
			printf("\nposition server sent: %s\n", res_json_str);
			zmsg_addstr(resp_msg, res_json_str);
			free(res_json_str);

			zmsg_wrap(resp_msg, address);
			zmsg_send(&resp_msg, router);

			json_decref(response_json);
		}
		json_decref(request_json);
	}

}
