#include<czmq.h>
#include<stdio.h>
#include<jansson.h>
#include"request_store.h"

void web_request(void *sweb, req_store_t * req_store, void *spss, void *sgraph)
{

	zmsg_t *msg = zmsg_recv(sweb);
	zframe_t *address = zmsg_unwrap(msg);
	json_t *req_json;
	json_error_t error;
	req_json =
	    json_loads((const char *)zframe_data(zmsg_first(msg)), 0, &error);
	zmsg_destroy(&msg);

	int32_t requestId = request_store_add(req_store, address, req_json);

	json_t *clientRequest = json_object_get(req_json, "clientRequest");
	json_t *request = json_object_get(clientRequest, "request");

	const char *type = json_string_value(json_object_get(request, "type"));

	if (strcmp(type, "searchRequest") == 0) {

		json_t *pss_request = json_object();
		json_object_set_new(pss_request, "requestId",
				    json_integer(requestId));
		json_object_set(pss_request, "request", request);

		zmsg_t *req = zmsg_new();
		char *pss_req_str = json_dumps(pss_request, JSON_COMPACT);
		zmsg_addstr(req, pss_req_str);
		free(pss_req_str);
		zmsg_send(&req, spss);

		json_decref(pss_request);

	} else {
		//TODO process request
		if (strcmp(type, "updateRequest") == 0) {
			//an update request
		} else {
			//malformed request
			printf("i received a malformed request : %s", type);
			//delete request 

			request_store_delete(req_store, requestId);

		}
	}

	free((char *)type);

}

void pss_response(void *spss, req_store_t * req_store, void *sweb, void *sgraph)
{

	zmsg_t *msg = zmsg_recv(spss);
	json_error_t error;
	json_t *pss_resp_json =
	    json_loads((const char *)zframe_data(zmsg_first(msg)), 0, &error);
	zmsg_destroy(&msg);

	//identify the request
	int32_t id =
	    json_integer_value(json_object_get(pss_resp_json, "requestId"));

	req_t *req = request_store_req(req_store, id);

	json_t *response = json_object_get(pss_resp_json, "response");
	json_incref(response);

	const char *resp_type =
	    json_string_value(json_object_get(response, "type"));

	const char *req_type =
	    json_string_value(json_object_get
			      (json_object_get
			       (json_object_get(req->request, "clientRequest"),
				"request"), "type"));
	if (strcmp(resp_type, "retrieveResponse") == 0) {

		if (strcmp(req_type, "searchRequest") == 0) {

//store the locations and request the content

			req->response = response;
			json_decref(pss_resp_json);

			json_t *nodeArray =
			    json_object_get(response, "nodeArray");

			json_t *idArray = json_array();

			int i;
			for (i = 0; i < json_array_size(nodeArray); i++) {

				json_array_append(idArray,
						  json_object_get(json_array_get
								  (nodeArray,
								   i), "id"));

			}

			json_t *graph_request = json_object();
			json_object_set_new(graph_request, "requestId",
					    json_integer(id));
			json_t *retrieveRequest = json_object();
			json_object_set_new(retrieveRequest, "type",
					    json_string("retrieveRequest"));
			json_object_set_new(retrieveRequest, "idArray",
					    idArray);
			json_object_set_new(graph_request, "request",
					    json_string("retrieveReqeust"));

			zmsg_t *req = zmsg_new();
			char *graph_req_str =
			    json_dumps(graph_request, JSON_COMPACT);
			zmsg_addstr(req, graph_req_str);
			free(graph_req_str);
			zmsg_send(&req, sgraph);
			json_decref(graph_request);

		}
	} else {

	}
	free((char *)resp_type);
	free((char *)req_type);
}

void graph_response(void *sgraph, req_store_t * req_store, void *sweb,
		    void *spss)
{

	zmsg_t *msg = zmsg_recv(sgraph);
	json_error_t error;
	json_t *graph_resp_json =
	    json_loads((const char *)zframe_data(zmsg_first(msg)), 0, &error);
	zmsg_destroy(&msg);

	//identify the request
	int32_t id =
	    json_integer_value(json_object_get(graph_resp_json, "requestId"));

	req_t *req = request_store_req(req_store, id);
	json_t *request = req->request;

	json_t *response = json_object_get(graph_resp_json, "response");

	const char *resp_type =
	    json_string_value(json_object_get(response, "type"));

	const char *req_type =
	    json_string_value(json_object_get
			      (json_object_get
			       (json_object_get(request, "clientRequest"),
				"request"), "type"));

	if (strcmp(resp_type, "retrieveResponse") == 0) {
		if (strcmp(req_type, "searchRequest") == 0) {

//a retrieveResponse might not have originated from a searchRequest

			json_t *nodeArray =
			    json_object_get(req->response, "nodeArray");
			json_t *nodeDataArray =
			    json_object_get(response, "nodeArray");

			assert(json_array_size(nodeArray) ==
			       json_array_size(nodeDataArray));
//add the content data to the location data
			int i;
			for (i = 0; i < json_array_size(nodeArray); i++) {

				json_t *node = json_array_get(nodeArray, i);

				int64_t id =
				    json_integer_value(json_object_get
						       (node, "id"));
				int j;
				for (j = 0; j < json_array_size(nodeDataArray);
				     j++) {

					json_t *dataNode =
					    json_array_get(nodeDataArray, j);
					if (id ==
					    json_integer_value(json_object_get
							       (dataNode,
								"id"))) {

						json_object_set_new(node,
								    "nodeData",
								    dataNode);
						break;
					}

				}

//TODO Put an assert here so that we are sure that all nodes have content

			}

			json_t *web_resp = json_object();

			json_object_set(web_resp, "sessionId",
					json_object_get(request, "sessionId"));
			json_t *clientResponse = json_object();
			json_object_set(clientResponse, "clientRequestId",
					json_object_get(json_object_get
							(request,
							 "clientRequest"),
							"clientRequestId"));
			json_t *cl_response = json_object();
			json_object_set_new(cl_response, "type",
					    json_string("searchResponse"));
			json_object_set_new(cl_response, "nodeArray",
					    nodeArray);
			json_object_set_new(clientResponse, "response",
					    cl_response);
			zmsg_t *res = zmsg_new();
			char
			*web_res_str = json_dumps(web_resp,
						  JSON_COMPACT);
			zmsg_addstr(res, web_res_str);
			free(web_res_str);
			zmsg_wrap(res, req->address);
			zmsg_send(&res, sweb);
			json_decref(req->request);
			json_decref(req->response);
			json_decref(graph_resp_json);
		}
	} else {

	}

	free((char *)resp_type);
	free((char *)req_type);
}

int main(int argc, char
	 *argv[])
{

	if (argc != 3) {
		printf
		    ("\nPlease provide the ip address for the server to bind and the port");
		exit(1);
	}
	zctx_t *ctx = zctx_new();
	//create the server sockets 
	void *sweb = zsocket_new(ctx,
				 ZMQ_ROUTER);
	int port = atoi(argv[2]);
	int rc = zsocket_bind(sweb,
			      "tcp://%s:%d",
			      argv[1],
			      port);
	if (rc != port) {
		printf("The broker could't bind to %s:%d", argv[1], port);
	}

	void *spss = zsocket_new(ctx,
				 ZMQ_DEALER);
	port++;
	rc = zsocket_bind(spss, "tcp://%s:%d", argv[1], port);
	if (rc != port) {
		printf("The broker could't bind to %s:%d", argv[1], port);
	}

	void *sgraph = zsocket_new(ctx,
				   ZMQ_DEALER);
	port++;
	rc = zsocket_bind(sgraph, "tcp://%s:%d", argv[1], port);
	if (rc != port) {
		printf("The broker could't bind to %s:%d", argv[1], port);
	}
//initialize request store
	req_store_t *req_store;
	request_store_init(&req_store);
	zpoller_t *poller = zpoller_new(sweb,
					spss,
					sgraph);
	while (1) {
		void *which = zpoller_wait(poller,
					   -1);
		if (!zpoller_terminated(poller)) {
			return -1;
		}
		if (!zpoller_expired(poller)) {

			if (which == sweb) {
				web_request(sweb, req_store, spss, sgraph);
			}
			if (which == spss) {
				pss_response(spss, req_store, sweb, sgraph);
			}

			if (which == sgraph) {
				graph_response(sgraph, req_store, sweb, spss);
			}

		}

	}

}
