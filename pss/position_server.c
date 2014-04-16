#include"positiondb.h"
#include"quadtrie-c/quadbit.h"
#include<stdio.h>
#include<czmq.h>
#include<jansson.h>

json_t *search(quadbit_t * quadbit, json_t * json)
{
	json_t *response_json = json_object();

	json_t *res_data_json = json_array();
	json_t *json_searchArray = json_object_get(json, "searchArray");
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
				json_object_set_new(node, "x",
						    json_integer(res_item->x));
				json_object_set_new(node, "y",
						    json_integer(res_item->y));
				json_object_set_new(node, "id",
						    json_integer(res_item->id));
				json_array_append(res_data_json, node);

				res_item =
				    (pos_id_t *) quadbit_iter_next(&qiter);
			}

		} else {

			json_t *node = json_object();
			json_object_set_new(node, "x",
					    json_integer(res_item->x));
			json_object_set_new(node, "y",
					    json_integer(res_item->y));
			json_object_set_new(node, "id",
					    json_integer(res_item->id));
			json_array_append(res_data_json, node);
		}
		json_object_set_new(response_json, "data", res_data_json);
		json_decref(res_data_json);
	}

	return response_json;

}

json_t *insert(positiondb_t * positiondb, quadbit_t * quadbit, json_t * json)
{

	json_t *json_data = json_object_get(json, "data");

	pos_id_t *item = malloc(sizeof(pos_id_t));
	item->x = json_integer_value(json_object_get(json_data, "x"));
	item->y = json_integer_value(json_object_get(json_data, "y"));
	item->id = json_integer_value(json_object_get(json_data, "id"));

//do not accept a new node with the same location
	if (quadbit_search(quadbit, (quadbit_item_t *) item)) {
//TODO need to send a meaningfull response
		return NULL;
	}
	positiondb_insert_pos_id(positiondb, item);
	quadbit_insert(quadbit, (quadbit_item_t *) item);

	//we need a hash because the client accepts a hash
	json_t *json_data_id_hash = json_object();
	char id[64];
	sprintf(id, "%ld", item->id);
	json_object_set_new(json_data_id_hash, id, json_data);
	json_t *response_json = json_object();
	json_object_set_new(response_json, "data", json_data_id_hash);
	return response_json;

}

json_t *delete(positiondb_t * positiondb, quadbit_t * quadbit, json_t * json)
{
	pos_id_t item;
	item.x = json_integer_value(json_object_get(json, "x"));
	item.y = json_integer_value(json_object_get(json, "y"));
	item.id = json_integer_value(json_object_get(json, "id"));

	free(quadbit_remove(quadbit, (quadbit_item_t *) & item));

	positiondb_delete_pos_id(positiondb, item.id);

	//we need a hash because the client accepts a hash
	json_t *json_data_id_hash = json_object();
	char id[64];
	sprintf(id, "%ld", item.id);
	json_object_set_new(json_data_id_hash, id, json_null());
	json_t *response_json = json_object();
	json_object_set_new(response_json, "data", json_data_id_hash);
	return response_json;

}

int main(int argc, char *argv[])
{

	if (argc != 3) {
		printf
		    ("\nPlease provide the ip address for the server to bind and the port");
		exit(1);
	}
	//create the server sockets
	zctx_t *ctx = zctx_new();
	void *router = zsocket_new(ctx, ZMQ_ROUTER);
	int port = atoi(argv[2]);
	int rc = zsocket_connect(router, "tcp://%s:%d", argv[1], port);
	if (rc != port) {
		printf("The position_server could't connect to %s:%d", argv[1],
		       port);
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

	zpoller_t *poller = zpoller_new(router);

	while (1) {
		zpoller_wait(poller, -1);
		if (!zpoller_terminated(poller)) {
			return -1;
		}
		if (!zpoller_expired(poller)) {

			zmsg_t *request = zmsg_recv(router);
			zframe_t *address = zmsg_unwrap(request);
			json_t *json;
			json_error_t error;
			json =
			    json_loads((const char *)
				       zframe_data(zmsg_first(request)), 0,
				       &error);
			zmsg_destroy(&request);

			json_t *response_json;
			int type =
			    json_integer_value(json_object_get(json, "type"));
			switch (type) {

			case 0:
				response_json = search(quadbit, json);
			case 1:
				response_json =
				    insert(positiondb, quadbit, json);

			case 2:
				response_json =
				    delete(positiondb, quadbit, json);
			}

			json_object_set_new(response_json, "id",
					    json_object_get(json, "id"));
			json_object_set_new(response_json, "type",
					    json_integer(type));

			zmsg_t *response = zmsg_new();
			char *res_json_str =
			    json_dumps(response_json, JSON_COMPACT);
			zmsg_addstr(response, res_json_str);
			free(res_json_str);
			json_decref(response_json);

			json_decref(json);
			zmsg_wrap(response, address);
			zmsg_send(&response, router);
		}
	}

}
