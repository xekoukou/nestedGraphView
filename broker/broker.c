#include<czmq.h>
#include<stdio.h>
#include<jansson.h>
#include"request_store.h"

void process_request(void *sweb, req_store_t *req_store, void *spsr, void *sgraph)
{

	zmsg_t *msg = zmsg_recv(sweb);
	zframe_t *address = zmsg_unwrap(msg);
	json_t *req_json;
	json_error_t error;
	json =
	    json_loads((const char *)zframe_data(zmsg_first(msg)), 0, &error);
	zmsg_destroy(&msg);


		request_store_add(req_store, address, req_json);

                 json_t * request = json_object_get(json_object_get(req_json,"clientRequest"),"request");

		const char *type =
		    json__value(json_string_get(request, "type"));

		json_t *browser_request =
		    json_object_get(json, "browser_request");
		if (strcmp(type, "searchRequest") == 0) {
			// a search request 
			json_t *searchArray =
			    json_object_get(browser_request, "searchArray");
			json_t *request = json_object();
			json_object_set_new(request, "type", json_integer(0));
			json_object_set_new(request, "id", json_string(id));
			json_object_set_new(request, "searchArray",
					    searchArray);

			zmsg_t *req = zmsg_new();
			char *req_json_str = json_dumps(request, JSON_COMPACT);
			zmsg_addstr(req, req_json_str);
			free(req_json_str);
			json_decref(request);
			zmsg_send(&req, spsr);

		} else {
			//TODO process request
			if (strcmp(type, "updateRequest") == 0) {
				//an update request
			} else {
				//malformed request
				printf("i received a malformed request : %s",
				       type);
				//delete request 

				request_store_delete(rmap, id);

			}
		}

	}

}

void psr_response(void *spsr, khash_t(rmap) * rmap, void *sweb, void *sgraph)
{

	zmsg_t *msg = zmsg_recv(spsr);
	json_t *json;
	json_error_t error;
	json =
	    json_loads((const char *)zframe_data(zmsg_first(msg)), 0, &error);
	zmsg_destroy(&msg);

	//identify the request
	const char *id = json_string_value(json_object_get(json, "id"));
//store the locations and request the content

	req_t *req = request_store_req(rmap, id);
	req->response = json;

	//request the content from the graph database

}

void graph_response(void *sgraph, khash_t(rmap) * rmap, void *sweb, void *spsr)
{
}

int main(int argc, char *argv[])
{

	if (argc != 3) {
		printf
		    ("\nPlease provide the ip address for the server to bind and the port");
		exit(1);
	}
	zctx_t *ctx = zctx_new();

	//create the server sockets 
	void *sweb = zsocket_new(ctx, ZMQ_ROUTER);
	int port = atoi(argv[2]);
	int rc = zsocket_bind(sweb, "tcp://%s:%d", argv[1], port);
	if (rc != port) {
		printf("The broker could't bind to %s:%d", argv[1], port);
	}
	void *spsr = zsocket_new(ctx, ZMQ_DEALER);
	port = atoi(argv[2]) + 1;
	rc = zsocket_bind(spsr, "tcp://%s:%d", argv[1], port);
	if (rc != port) {
		printf("The broker could't bind to %s:%d", argv[1], port);
	}
	void *sgraph = zsocket_new(ctx, ZMQ_DEALER);
	port = atoi(argv[2]) + 2;
	rc = zsocket_bind(sgraph, "tcp://%s:%d", argv[1], port);
	if (rc != port) {
		printf("The broker could't bind to %s:%d", argv[1], port);
	}
//initialize request store
req_store_t *req_store;
request_store_init(&req_store);

	zpoller_t *poller = zpoller_new(sweb, spsr, sgraph);
	while (1) {
		void *which = zpoller_wait(poller, -1);
		if (!zpoller_terminated(poller)) {
			return -1;
		}
		if (!zpoller_expired(poller)) {

			if (which == sweb) {
				process_request(sweb, req_store, spsr, sgraph);
			}
			if (which == spsr) {
				psr_response(spsr, req_store, sweb, sgraph);
			}

			if (which == sgraph) {
				graph_response(sgraph, req_store, sweb, spsr);

			}

		}

	}

}
