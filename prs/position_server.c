#include"localdb.h"
#include"quadtrie-c/quadtrie.h"
#include<stdio.h>
#include<czmq.h>
#include<jansson.h>

int main(int argc, char
	 *argv[])
{

	if (argc != 2) {
		printf
		    ("\nPlease provide the ip address for the server to bind and the port");
	}
	//create the server sockets
	zctx_t *ctx = zctx_new();
	void *router = zsocket_new(ctx, ZMQ_ROUTER);
	int port = atoi(argv[1]);
	int rc = zsocket_bind(dealer, "tcp://%s:%d", argv[0], port);
	if (rc != port) {
		printf
		    ("The position_server could't bind in the address and port specified");
	}
	//init the database
	localdb_t *localdb;
	localdb_init(&localdb);

	//init the quadtrie
	quadbit_t *quadbit;
	quadbit_init(&quadbit);

	//load the nodes

	leveldb_iterator_t
	    * iter = leveldb_create_iterator(localdb->db, localdb->readoptions);

	pos_id_t *pos_id = localdb_first(iter);
	while (pos_id) {
		quadbit_insert(quadbit, (quadbit_item_t *)
			       pos_id);
		pos_id = localdb_next(iter);
	}

	//main loop

	zpoller_t *poller = zpoller_new(router);

	while (1) {
		zpoller_wait(poller, -1);
		if (!zpoller_terminated(poller)) {
			return -1;
		}
		if (!zpoller_expired(poller)) {

			//TODO add the second request from the nodejs
			zmsg_t *response = zmsg_new();

			zmsg_t *request = zmsg_recv(router);
			zframe_t *address = zmsg_unwrap(request);
			zframe_t *id = zmsg_pop(request);
			zmsg_append(response, id);
			json_t *json;
			json_error_t error;
			json =
			    json_loads(zframe_data(zmsg_first(request)), 0,
				       &error);
			zmsg_destroy(&request);

			json_t *response_json = json_array();

			for (int i = 0; i < json_array_size(json); i++) {
				json_t *set = json_array_get(json, i);

				quadbit_item_t search;
				search.x =
				    json_integer_value(json_object_get
						       (set, "x"));
				search.y =
				    json_integer_value(json_object_get
						       (set, "y"));
				uint8_t pos =
				    json_integer_value(json_object_get
						       (set, "pos"));
				quadbit_node_t *res_parent = NULL;
				pos_id_t
				    * res_item =
				    (pos_id_t *) quadbit_search_set(quadbit,
								    search,
								    &res_parent,
								    pos);
				if (res_parent) {

					res_item =
					    quadbit_iter_first(quadbit,
							       res_parent);
					while (res_item) {

						json_t *node = json_object();
						json_object_set_new(node, "x",
								    json_integer
								    (res_item->x));
						json_object_set_new(node, "y",
								    json_integer
								    (res_item->y));
						json_object_set_new(node, "id",
								    json_string
								    (res_item->id));
						json_array_append(response_json,
								  node);

						res_item =
						    quadbit_iter_next(quadbit);
					}

				} else {

					json_t *node = json_object();
					json_object_set_new(node, "x",
							    json_integer
							    (res_item->x));
					json_object_set_new(node, "y",
							    json_integer
							    (res_item->y));
					json_object_set_new(node, "id",
							    json_string
							    (res_item->id));
					json_array_append(response_json, node);
				}
				char *res_json_str =
				    json_dumps(response_json, JSON_COMPACT);
				zmsg_append(response,
					    zframe_new(res_json_str,
						       strlen(res_json_str)));
				free(res_json_str);

			}
			json_decref(json);
			json_decref(response_json);

			zmsg_wrap(response, address);
			zmsg_send(&response, dealer);
		}
	}

}
