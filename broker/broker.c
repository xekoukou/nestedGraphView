#include <czmq.h>
#include <stdio.h>
#include <jansson.h>
#include "request_store.h"

void web_request_searchRequest(int32_t requestId, json_t * request, void *spss)
{

	json_t *pss_request = json_object();
	json_object_set_new(pss_request, "requestId", json_integer(requestId));
	json_object_set(pss_request, "request", request);

	zmsg_t *req = zmsg_new();
	char *pss_req_str = json_dumps(pss_request, JSON_COMPACT);
	printf("\nbroker:spss sent: %s\n", pss_req_str);
	zmsg_addstr(req, pss_req_str);
	free(pss_req_str);
	zmsg_send(&req, spss);

	json_decref(pss_request);

}

void web_request_newNode(int32_t requestId, json_t * request, void *sgraph)
{
	json_t *graph_request = json_object();
	json_object_set_new(graph_request, "requestId",
			    json_integer(requestId));
	json_t *newNodeRequest = json_object();
	json_object_set_new(newNodeRequest, "type", json_string("newNode"));
	json_object_set_new(graph_request, "request", newNodeRequest);

	zmsg_t *req = zmsg_new();
	char *graph_req_str = json_dumps(graph_request, JSON_COMPACT);
	printf("\nbroker:sgraph sent: %s\n", graph_req_str);
	zmsg_addstr(req, graph_req_str);
	free(graph_req_str);
	zmsg_send(&req, sgraph);

	json_decref(graph_request);

}

void web_request_newPosition(int32_t requestId, json_t * request, void *spss)
{

	json_t *pss_request = json_object();
	json_object_set_new(pss_request, "requestId", json_integer(requestId));
	json_object_set(pss_request, "request", request);

	zmsg_t *req = zmsg_new();
	char *pss_req_str = json_dumps(pss_request, JSON_COMPACT);
	printf("\nbroker:spss sent: %s\n", pss_req_str);
	zmsg_addstr(req, pss_req_str);
	free(pss_req_str);
	zmsg_send(&req, spss);

	json_decref(pss_request);

}

void web_request_newLink(int32_t requestId, json_t * request, void *sgraph)
{
	json_t *graph_request = json_object();
	json_object_set_new(graph_request, "requestId",
			    json_integer(requestId));
	json_object_set(graph_request, "request", request);

	zmsg_t *req = zmsg_new();
	char *graph_req_str = json_dumps(graph_request,
					 JSON_COMPACT);
	printf("\nbroker:sgraph sent: %s\n", graph_req_str);
	zmsg_addstr(req, graph_req_str);
	free(graph_req_str);
	zmsg_send(&req, sgraph);

	json_decref(graph_request);

}

void web_request_delLink(int32_t requestId, json_t * request, void *sgraph)
{

	json_t *graph_request = json_object();
	json_object_set_new(graph_request, "requestId",
			    json_integer(requestId));
	json_object_set(graph_request, "request", request);

	zmsg_t *req = zmsg_new();
	char *graph_req_str = json_dumps(graph_request,
					 JSON_COMPACT);
	printf("\nbroker:sgraph sent: %s\n", graph_req_str);
	zmsg_addstr(req, graph_req_str);
	free(graph_req_str);
	zmsg_send(&req, sgraph);

	json_decref(graph_request);

}

void web_request_delNode(int32_t requestId, json_t * request, void *sgraph)
{

	json_t *wrequest = json_object();
	json_object_set_new(wrequest, "requestId", json_integer(requestId));
	json_object_set(wrequest, "request", request);

	zmsg_t *req = zmsg_new();
	char *req_str = json_dumps(wrequest,
				   JSON_COMPACT);
	printf("\nbroker:sgraph sent: %s\n", req_str);
	zmsg_addstr(req, req_str);
	free(req_str);
	zmsg_send(&req, sgraph);

	json_decref(wrequest);

}

void web_request_newNodeData(int32_t requestId, json_t * request, void *sgraph)
{
	json_t *graph_request = json_object();
	json_object_set_new(graph_request, "requestId",
			    json_integer(requestId));
	json_object_set(graph_request, "request", request);

	zmsg_t *req = zmsg_new();
	char *graph_req_str = json_dumps(graph_request,
					 JSON_COMPACT);
	printf("\nbroker:sgraph sent: %s\n", graph_req_str);
	zmsg_addstr(req, graph_req_str);
	free(graph_req_str);
	zmsg_send(&req, sgraph);

	json_decref(graph_request);

}

void web_request_newLinkData(int32_t requestId, json_t * request, void *sgraph)
{
	json_t *graph_request = json_object();
	json_object_set_new(graph_request, "requestId",
			    json_integer(requestId));
	json_object_set(graph_request, "request", request);

	zmsg_t *req = zmsg_new();
	char *graph_req_str = json_dumps(graph_request,
					 JSON_COMPACT);
	printf("\nbroker:sgraph sent: %s\n", graph_req_str);
	zmsg_addstr(req, graph_req_str);
	free(graph_req_str);
	zmsg_send(&req, sgraph);

	json_decref(graph_request);

}

void web_request(void *sweb, req_store_t * req_store, void *spss, void *sgraph)
{

	zmsg_t *msg = zmsg_recv(sweb);
	zframe_t *address = zmsg_unwrap(msg);
	json_t *req_json;
	json_error_t error;
	printf("\nbroker:sweb received: %s\n",
	       (const char *)zframe_data(zmsg_first(msg)));
	const char *data;
	size_t data_size = zframe_size(zmsg_first(msg));
	data = zframe_data(zmsg_first(msg));
	req_json = json_loadb(data, data_size, 0, &error);
	zmsg_destroy(&msg);

	int32_t requestId = request_store_add(req_store, address, req_json);

	json_t *clientRequest = json_object_get(req_json, "clientRequest");
	json_t *request = json_object_get(clientRequest, "request");

	const char *type = json_string_value(json_object_get(request, "type"));

	if (strcmp(type, "searchRequest") == 0)

		web_request_searchRequest(requestId, request, spss);

	else if (strcmp(type, "newNode") == 0)

		web_request_newNode(requestId, request, sgraph);

	else if (strcmp(type, "newPosition") == 0)

		web_request_newPosition(requestId, request, spss);

	else if (strcmp(type, "newLink") == 0)

		web_request_newLink(requestId, request, sgraph);

	else if (strcmp(type, "delLink") == 0)

		web_request_delLink(requestId, request, sgraph);

	else if (strcmp(type, "delNode") == 0)

		web_request_delNode(requestId, request, sgraph);

	else if (strcmp(type, "newNodeData") == 0)

		web_request_newNodeData(requestId, request, sgraph);
	else if (strcmp(type, "newLinkData") == 0)

		web_request_newLinkData(requestId, request, sgraph);
	else {

		//TODO process request
		//malformed request
		printf("\ni received a malformed request : %s", type);
		//delete request 
		zframe_destroy(&address);
		request_store_delete(req_store, requestId);
	}

}

void pss_response_searchResponse(req_t * req, json_t * response,
				 int32_t requestId, void *sgraph)
{

	//store the locations and request the content

	req->response = response;

	json_t *nodeArray = json_object_get(response, "nodeArray");

	json_t *idArray = json_array();
	json_t *ancestorIdArray = json_array();

	int i;
	for (i = 0; i < json_array_size(nodeArray); i++) {

		json_array_append(idArray,
				  json_object_get(json_array_get
						  (nodeArray, i), "id"));
		json_array_append(ancestorIdArray,
				  json_object_get(json_array_get
						  (nodeArray, i), "ancestorId"));

	}

	json_t *graph_request = json_object();
	json_object_set_new(graph_request, "requestId",
			    json_integer(requestId));
	json_t *retrieveRequest = json_object();
	json_object_set_new(retrieveRequest, "type",
			    json_string("retrieveRequest"));
	json_object_set_new(retrieveRequest, "idArray", idArray);
	json_object_set_new(retrieveRequest, "ancestorIdArray", ancestorIdArray);
	json_object_set_new(graph_request, "request", retrieveRequest);

	zmsg_t *mreq = zmsg_new();
	char *graph_req_str = json_dumps(graph_request, JSON_COMPACT);
	printf("\nbroker:sgraph sent: %s\n", graph_req_str);
	zmsg_addstr(mreq, graph_req_str);
	free(graph_req_str);
	zmsg_send(&mreq, sgraph);
	json_decref(graph_request);

}

void pss_response_newNodeResponse(req_t * req, json_t * response,
				  int32_t requestId, void *sweb,
				  req_store_t * req_store)
{

	const char *ack = json_string_value(json_object_get(response, "ack"));

	if (strcmp(ack, "ok") == 0) {

		json_t *web_resp = json_object();
		json_object_set_new(web_resp, "type", json_string("newData"));
		//TODO at the moment only the original node gets the update, which is good enough for me
		json_t *sessionIds = json_array();
		json_array_append(sessionIds,
				  json_object_get(req->request, "sessionId"));
		json_object_set_new(web_resp, "sessionIds", sessionIds);

		json_t *newData = json_object();
		json_t *newNodes = json_array();
		json_array_append(newNodes,
				  json_object_get
				  (json_object_get
				   (json_object_get
				    (req->request,
				     "clientRequest"), "request"), "node"));
		json_object_set_new(newData, "newNodes", newNodes);

		json_object_set_new(web_resp, "newData", newData);

		zmsg_t *res = zmsg_new();
		char *web_res_str = json_dumps(web_resp, JSON_COMPACT);
		printf("\nbroker:sweb sent: %s\n", web_res_str);
		zmsg_addstr(res, web_res_str);
		free(web_res_str);
		zmsg_wrap(res, req->address);
		zmsg_send(&res, sweb);
		json_decref(web_resp);

	} else {

		if (strcmp(ack, "fail") == 0) {
			//TODO ask the graph to delete the node
		}

	}
	json_decref(response);
	request_store_delete(req_store, requestId);
}

void pss_response_delNode(req_t * req, json_t * response, int32_t requestId,
			  void *sweb, req_store_t * req_store)
{
	const char *ack = json_string_value(json_object_get(response,
							    "ack"));

	if (strcmp(ack, "ok") == 0) {

		json_t *web_resp = json_object();
		json_object_set_new(web_resp, "type", json_string("newData"));
		//TODO at the moment only the original node gets the update, which is good enough for me
		json_t *sessionIds = json_array();
		json_array_append(sessionIds,
				  json_object_get(req->request, "sessionId"));
		json_object_set_new(web_resp, "sessionIds", sessionIds);

		json_t *newData = json_object();
		json_t *deletedNodes = json_array();
		json_array_append(deletedNodes,
				  json_object_get
				  (json_object_get
				   (json_object_get
				    (req->request,
				     "clientRequest"), "request"), "id"));
		json_object_set_new(newData, "deletedNodes", deletedNodes);

		json_object_set_new(web_resp, "newData", newData);

		zmsg_t *res = zmsg_new();
		char *web_res_str = json_dumps(web_resp,
					       JSON_COMPACT);

		printf("\nbroker:sweb sent: %s\n", web_res_str);
		zmsg_addstr(res, web_res_str);
		free(web_res_str);
		zmsg_wrap(res, req->address);
		zmsg_send(&res, sweb);
		json_decref(web_resp);

	} else {

		if (strcmp(ack, "fail") == 0) {
			//TODO ??
		}
	}
	request_store_delete(req_store, requestId);
	json_decref(response);

}

void pss_response(void *spss, req_store_t * req_store, void *sweb, void *sgraph)
{

	zmsg_t *msg = zmsg_recv(spss);
	zframe_t *null = zmsg_unwrap(msg);
	zframe_destroy(&null);
	json_error_t error;
	printf("\nbroker:spss received: %s\n",
	       (const char *)zframe_data(zmsg_first(msg)));
	const char *data;
	size_t data_size = zframe_size(zmsg_first(msg));
	data = zframe_data(zmsg_first(msg));

	json_t *pss_resp_json = json_loadb(data,
					   data_size, 0, &error);
	zmsg_destroy(&msg);

	//identify the request
	int32_t requestId =
	    json_integer_value(json_object_get(pss_resp_json, "requestId"));

	req_t *req = request_store_req(req_store, requestId);

	json_t *response = json_object_get(pss_resp_json, "response");
	json_incref(response);
	json_decref(pss_resp_json);

	const char *resp_type =
	    json_string_value(json_object_get(response, "type"));

	const char *req_type =
	    json_string_value(json_object_get
			      (json_object_get
			       (json_object_get(req->request, "clientRequest"),
				"request"), "type"));
	if ((strcmp(resp_type, "searchResponse") == 0)
	    && (strcmp(req_type, "searchRequest") == 0))

		pss_response_searchResponse(req, response, requestId, sgraph);

	else if ((strcmp(resp_type, "newNodeResponse") == 0)
		 && (strcmp(req_type, "newNode") == 0))
		pss_response_newNodeResponse(req, response, requestId, sweb,
					     req_store);

	else if ((strcmp(resp_type, "delNode") == 0)
		 && (strcmp(req_type, "delNode") == 0))
		pss_response_delNode(req, response, requestId, sweb, req_store);

	else {

	}

}

void graph_response_retrieveResponse(req_t * req, json_t * response,
				     int32_t requestId, void *sweb,
				     req_store_t * req_store)
{

	json_t *nodeArray = json_object_get(req->response, "nodeArray");
	json_t *nodeDataArray = json_object_get(response, "nodeArray");

//TODO handle this case
/*	assert(json_array_size(nodeArray) == json_array_size(nodeDataArray));  */
	//add the content data to the location data
	int i;
	for (i = 0; i < json_array_size(nodeArray); i++) {

		json_t *node = json_array_get(nodeArray, i);

		int64_t id = json_integer_value(json_object_get(node, "id"));
		int j;
		for (j = 0; j < json_array_size(nodeDataArray); j++) {

			json_t *dataNode = json_array_get(nodeDataArray, j);
			if (id ==
			    json_integer_value(json_object_get
					       (dataNode, "id"))) {

				json_object_set(node, "node", dataNode);
				break;
			}

		}

		//TODO Put an assert here so that we are sure that all nodes have content

	}

	json_t *web_resp = json_object();

	json_object_set(web_resp, "sessionId",
			json_object_get(req->request, "sessionId"));
	json_object_set_new(web_resp, "type", json_string("response"));
	json_t *clientResponse = json_object();
	json_object_set(clientResponse, "clientRequestId",
			json_object_get(json_object_get
					(req->request,
					 "clientRequest"), "clientRequestId"));
	json_t *cl_response = json_object();
	json_object_set_new(cl_response, "type", json_string("searchResponse"));
	json_object_set(cl_response, "nodeArray", nodeArray);
	json_object_set_new(clientResponse, "response", cl_response);
	json_object_set_new(web_resp, "clientResponse", clientResponse);
	zmsg_t *res = zmsg_new();
	char *web_res_str = json_dumps(web_resp,
				       JSON_COMPACT);
	printf("\nbroker:sweb sent: %s\n", web_res_str);
	zmsg_addstr(res, web_res_str);
	free(web_res_str);
	zmsg_wrap(res, req->address);
	zmsg_send(&res, sweb);
	request_store_delete(req_store, requestId);
	json_decref(web_resp);

}

void graph_response_newNodeResponse(json_t * request, json_t * response,
				    int32_t requestId, void *spss,
				    req_store_t * req_store)
{

	json_t *pss_request = json_object();
	json_object_set_new(pss_request, "type", json_string("newNodeRequest"));

	json_t *node = json_object_get(request,
				       "node");
	//set the id of the node
	json_object_set(json_object_get(node, "node"),
			"id", json_object_get(response, "id"));
	json_object_set(node, "id", json_object_get(response, "id"));
	json_t *pnode = json_object();
	json_object_set(pnode, "posX", json_object_get(node, "posX"));
	json_object_set(pnode, "posY", json_object_get(node, "posY"));
	json_object_set(pnode, "id", json_object_get(response, "id"));
	json_object_set(pss_request, "node", pnode);

	json_t *pss_req = json_object();
	json_object_set_new(pss_req, "requestId", json_integer(requestId));
	json_object_set_new(pss_req, "request", pss_request);

	zmsg_t *req = zmsg_new();
	char *pss_req_str = json_dumps(pss_req,
				       JSON_COMPACT);
	printf("\nbroker:spss sent: %s\n", pss_req_str);
	zmsg_addstr(req, pss_req_str);
	free(pss_req_str);
	zmsg_send(&req, spss);
	json_decref(pss_req);

}

void graph_response_newLinkResponse(req_t * req, json_t * request,
				    json_t * response, int32_t requestId,
				    void *sweb, req_store_t * req_store)
{
	if (strcmp("ok", json_string_value(json_object_get(response, "ack"))) ==
	    0) {

		json_t *link = json_object_get(request,
					       "link");
		//set the id of the link
		json_object_set(json_object_get(link, "linkData"), "id",
				json_object_get(response, "id"));

		json_t *web_resp = json_object();
		json_object_set_new(web_resp, "type", json_string("newData"));
		//TODO at the moment only the original node gets the update, which is good enough for me
		json_t *sessionIds = json_array();
		json_array_append(sessionIds,
				  json_object_get(req->request, "sessionId"));
		json_object_set_new(web_resp, "sessionIds", sessionIds);

		json_t *newData = json_object();
		json_t *newLinks = json_array();
		json_array_append(newLinks, link);
		json_object_set_new(newData, "newLinks", newLinks);

		json_object_set_new(web_resp, "newData", newData);

		zmsg_t *res = zmsg_new();
		char *web_res_str = json_dumps(web_resp,
					       JSON_COMPACT);
		printf("\nbroker:sweb sent: %s\n", web_res_str);
		zmsg_addstr(res, web_res_str);
		free(web_res_str);
		zmsg_wrap(res, req->address);
		zmsg_send(&res, sweb);
		json_decref(web_resp);
	}

	request_store_delete(req_store, requestId);

}

void graph_response_delLinkResponse(req_t * req, json_t * request,
				    json_t * response, int32_t requestId,
				    void *sweb, req_store_t * req_store)
{

	if (strcmp
	    (json_string_value(json_object_get(response, "ack")), "ok") == 0) {

		json_t *link = json_object_get(request, "link");

		json_t *web_resp = json_object();
		json_object_set_new(web_resp, "type", json_string("newData"));
		//TODO at the moment only the original node gets the update, which is good enough for me
		json_t *sessionIds = json_array();
		json_array_append
		    (sessionIds, json_object_get(req->request, "sessionId"));
		json_object_set_new(web_resp, "sessionIds", sessionIds);

		json_t *newData = json_object();
		json_t *delLinks = json_array();
		json_array_append(delLinks, link);
		json_object_set_new(newData, "delLinks", delLinks);

		json_object_set_new(web_resp, "newData", newData);

		zmsg_t *res = zmsg_new();
		char *web_res_str = json_dumps(web_resp,
					       JSON_COMPACT);
		printf("\nbroker:sweb sent: %s\n", web_res_str);
		zmsg_addstr(res, web_res_str);
		free(web_res_str);
		zmsg_wrap(res, req->address);
		zmsg_send(&res, sweb);
		json_decref(web_resp);
	} else {
	}
	request_store_delete(req_store, requestId);

}

void graph_response_delNodeResponse(req_t * req, json_t * request,
				    json_t * response, int32_t requestId,
				    void *spss, req_store_t * req_store)
{
	const
	    char
	*ack = json_string_value(json_object_get(response,
						 "ack"));

	if (strcmp(ack, "ok") == 0) {

		json_t *wrequest = json_object();
		json_object_set_new
		    (wrequest, "requestId", json_integer(requestId));
		json_object_set(wrequest, "request", request);

		zmsg_t *req = zmsg_new();
		char *req_str = json_dumps(wrequest,
					   JSON_COMPACT);
		printf("\nbroker:spss sent: %s\n", req_str);
		zmsg_addstr(req, req_str);
		free(req_str);
		zmsg_send(&req, spss);
		json_decref(wrequest);

	}

	else {

		if (strcmp(ack, "fail") == 0) {
			// This can fail because of the existence of links
			// clean things up
		}
		request_store_delete(req_store, requestId);
	}

}

void graph_response_newNodeDataResponse(req_t * req, json_t * request,
					json_t * response, int32_t requestId,
					void *sweb, req_store_t * req_store)
{

	if (strcmp
	    (json_string_value(json_object_get(response, "ack")), "ok") == 0) {

		json_t *nodeData = json_object_get(request, "nodeData");
		json_t *id = json_object_get(request, "id");

		json_t *web_resp = json_object();
		json_object_set_new(web_resp, "type", json_string("newData"));
		//TODO at the moment only the original node gets the update, which is good enough for me
		json_t *sessionIds = json_array();
		json_array_append
		    (sessionIds, json_object_get(req->request, "sessionId"));
		json_object_set_new(web_resp, "sessionIds", sessionIds);

		json_t *newData = json_object();
		json_t *newNodeData = json_array();
		json_t *element = json_object();
		json_object_set(element, "id", id);
		json_object_set(element, "nodeData", nodeData);
		json_array_append(newNodeData, element);
		json_object_set_new(newData, "newNodeData", newNodeData);

		json_object_set_new(web_resp, "newData", newData);

		zmsg_t *res = zmsg_new();
		char *web_res_str = json_dumps(web_resp,
					       JSON_COMPACT);
		printf("\nbroker:sweb sent: %s\n", web_res_str);
		zmsg_addstr(res, web_res_str);
		free(web_res_str);
		zmsg_wrap(res, req->address);
		zmsg_send(&res, sweb);
		json_decref(web_resp);
	} else {
	}
	request_store_delete(req_store, requestId);

}

void graph_response_newLinkDataResponse(req_t * req, json_t * request,
					json_t * response, int32_t requestId,
					void *sweb, req_store_t * req_store)
{

	if (strcmp
	    (json_string_value(json_object_get(response, "ack")), "ok") == 0) {

		json_t *link = json_object_get(request, "link");

		json_t *web_resp = json_object();
		json_object_set_new(web_resp, "type",
				    json_string("newLinkData"));
		//TODO at the moment only the original node gets the update, which is good enough for me
		json_t *sessionIds = json_array();
		json_array_append
		    (sessionIds, json_object_get(req->request, "sessionId"));
		json_object_set_new(web_resp, "sessionIds", sessionIds);

		json_t *newData = json_object();
		json_t *newLinkData = json_array();
		json_array_append(newLinkData, link);
		json_object_set_new(newData, "newLinkData", newLinkData);

		json_object_set_new(web_resp, "newData", newData);

		zmsg_t *res = zmsg_new();
		char *web_res_str = json_dumps(web_resp,
					       JSON_COMPACT);
		printf("\nbroker:sweb sent: %s\n", web_res_str);
		zmsg_addstr(res, web_res_str);
		free(web_res_str);
		zmsg_wrap(res, req->address);
		zmsg_send(&res, sweb);
		json_decref(web_resp);
	} else {
	}
	request_store_delete(req_store, requestId);

}

void graph_response(void *sgraph, req_store_t * req_store, void *sweb,
		    void *spss)
{

	zmsg_t *msg = zmsg_recv(sgraph);
	zframe_t *null = zmsg_unwrap(msg);
	zframe_destroy(&null);
	json_error_t error;
	printf("\nbroker:sgraph received: %s\n",
	       (const char *)zframe_data(zmsg_first(msg)));
	const char *data;
	size_t data_size = zframe_size(zmsg_first(msg));
	data = zframe_data(zmsg_first(msg));

	json_t *graph_resp_json = json_loadb(data,
					     data_size, 0,
					     &error);
	zmsg_destroy(&msg);

	//identify the request
	int32_t requestId =
	    json_integer_value(json_object_get(graph_resp_json, "requestId"));

	req_t *req = request_store_req(req_store, requestId);

	json_t *response = json_object_get(graph_resp_json, "response");

	const char *resp_type =
	    json_string_value(json_object_get(response, "type"));

	json_t *request =
	    json_object_get(json_object_get(req->request, "clientRequest"),
			    "request");
	const char *req_type =
	    json_string_value(json_object_get(request, "type"));

	if ((strcmp(resp_type, "retrieveResponse") == 0)
	    && (strcmp(req_type, "searchRequest") == 0))

		graph_response_retrieveResponse(req, response,
						requestId, sweb, req_store);

	else if ((strcmp(resp_type, "newNodeResponse") == 0)
		 && (strcmp(req_type, "newNode") == 0))

		graph_response_newNodeResponse(request,
					       response,
					       requestId, spss, req_store);

	else if ((strcmp(resp_type, "newLinkResponse") == 0)
		 && (strcmp(req_type, "newLink") == 0))

		graph_response_newLinkResponse(req,
					       request,
					       response,
					       requestId, sweb, req_store);

	else if ((strcmp(resp_type, "delLinkResponse")
		  == 0) && (strcmp(req_type, "delLink")
			    == 0))

		graph_response_delLinkResponse(req,
					       request,
					       response,
					       requestId, sweb, req_store);

	else if ((strcmp(resp_type, "delNode") == 0)
		 && (strcmp(req_type, "delNode")
		     == 0))
		graph_response_delNodeResponse(req,
					       request,
					       response,
					       requestId, spss, req_store);

	else if ((strcmp(resp_type, "newNodeData")
		  == 0) && (strcmp(req_type, "newNodeData")
			    == 0))

		graph_response_newNodeDataResponse(req,
						   request,
						   response,
						   requestId, sweb, req_store);

	else if ((strcmp(resp_type, "newLinkData")
		  == 0) && (strcmp(req_type, "newLinkData")
			    == 0))

		graph_response_newLinkDataResponse(req,
						   request,
						   response,
						   requestId, sweb, req_store);

	json_decref(graph_resp_json);
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
	void *sweb = zsocket_new(ctx,
				 ZMQ_ROUTER);
	int port = atoi(argv[2]);
	int rc = zsocket_bind(sweb,
			      "tcp://%s:%d",
			      argv[1],
			      port);
	if (rc != port) {
		printf("\nThe broker:sweb could't bind to %s:%d", argv[1],
		       port);
		exit(-1);
	} else {
		printf("\nThe broker:sweb did bind to %s:%d", argv[1], port);

	}

	void *spss = zsocket_new(ctx,
				 ZMQ_DEALER);
	port++;
	rc = zsocket_bind(spss, "tcp://%s:%d", argv[1], port);
	if (rc != port) {
		printf("\nThe broker:spss could't bind to %s:%d", argv[1],
		       port);
		exit(-1);
	} else {
		printf("\nThe broker:spss did bind to %s:%d", argv[1], port);
	}

	void *sgraph = zsocket_new(ctx,
				   ZMQ_DEALER);
	port++;
	rc = zsocket_bind(sgraph, "tcp://%s:%d", argv[1], port);
	if (rc != port) {
		printf("\nThe broker:sgraph could't bind to %s:%d", argv[1],
		       port);
		exit(-1);
	} else {
		printf("\nThe broker:sgraph did bind to %s:%d", argv[1], port);
	}
	//initialize request store
	req_store_t *req_store;
	request_store_init(&req_store);

	zmq_pollitem_t poll_items[] = {

		{
		 sweb, 0, ZMQ_POLLIN, 0}
		, {
		   sgraph, 0, ZMQ_POLLIN, 0}
		, {
		   spss, 0, ZMQ_POLLIN, 0}

	};
	while (1) {
		int rc = zmq_poll(poll_items, 3, -1);
		if (rc == -1) {
			zmq_strerror(zmq_errno());
			exit(-1);
		}

		if (poll_items[2].revents & ZMQ_POLLIN) {
			pss_response(spss, req_store, sweb, sgraph);
		}

		if (poll_items[1].revents & ZMQ_POLLIN) {
			graph_response(sgraph, req_store, sweb, spss);
		}

		if (poll_items[0].revents & ZMQ_POLLIN) {
			web_request(sweb, req_store, spss, sgraph);
		}

	}

}
