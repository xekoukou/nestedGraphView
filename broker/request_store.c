#include "request_store.h"

void request_store_init(req_store_t ** req_store)
{

	*req_store = malloc(sizeof(req_store_t));
	(*req_store)->rmap = kh_init(rmap);
	(*req_store)->next_req_id = 1;
}

int32_t
request_store_add(req_store_t * req_store, zframe_t * address, json_t * request)
{

	khiter_t k;
	int ret;

	k = kh_put(rmap, req_store->rmap, req_store->next_req_id, &ret);
	kh_value(req_store->rmap, k).address = address;
	kh_value(req_store->rmap, k).request = request;
	kh_value(req_store->rmap, k).response = NULL;

	req_store->next_req_id++;
	return (req_store->next_req_id - 1);
}

void request_store_delete(req_store_t * req_store, int32_t id)
{

	khiter_t k;

	k = kh_get(rmap, req_store->rmap, id);
	if (k != kh_end(req_store->rmap)) {

		req_t *req = &(kh_val(req_store->rmap, k));
		json_decref(req->request);
		if (req->response) {
			json_decref(req->response);
		}
		kh_del(rmap, req_store->rmap, k);

	} else {
		printf("there was no request to delete\n");
	}
}

req_t *request_store_req(req_store_t * req_store, int32_t id)
{
	khiter_t k;
	k = kh_get(rmap, req_store->rmap, id);
	if (k != kh_end(req_store->rmap)) {
		return &(kh_value(req_store->rmap, k));
	}
	return NULL;
}
