#ifndef REQUEST_STORE_H
#define REQUEST_STORE_H

#include"khash.h"
#include<jansson.h>
#include<czmq.h>

struct req_t {
	zframe_t *address;
	json_t *request;
	json_t *response;
};

typedef struct req_t req_t;

KHASH_MAP_INIT_STR(rmap, req_t);

void request_store_add(khash_t(rmap) * rmap, const char *id, zframe_t * address,
		       json_t * request);

void request_store_delete(khash_t(rmap) * rmap, const char *id);

req_t *request_store_req(khash_t(rmap) * rmap, const char *id);

#endif
