include "request_store.h"
    void request_store_add(khash_t(rmap) * rmap, const char *id,
			   zframe_t * address, json_t * request)
{

	khiter_t k;
	int ret;

	k = kh_put(rmap, rmap, id, ret);
	kh_value(rmap, k).address = address;
	kh_value(rmap, k).request = json;

}

void request_store_delete(khash_t(rmap) * rmap, const char *id)
{

	k = kh_get(rmap, rmap, id);
	if (k != kh_end(rmap)) {

		req_t *req = &(kh_val(rmap, k));
		json_decref(req->json);
		zframe_destroy(&(req->address));

		kh_del(rmap, rmap, k);

	} else {
		printf("there was no request to delete\n");
	}
}

req_t *request_store_req(khash_t(rmap) * rmap, const char *id)
{
	khiter_t k;
	int ret;
	k = kh_get(rmap, rmap, id);
	if (k != kh_end(rmap)) {
		return &(kh_value(rmap, k));
	}
	return NULL;
}
