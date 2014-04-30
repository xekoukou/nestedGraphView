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

KHASH_MAP_INIT_INT(rmap, req_t);

struct req_store_t {

	khash_t(rmap) * rmap;
	int32_t next_req_id;
};

typedef struct req_store_t req_store_t;

void request_store_init(req_store_t ** req_store);

int32_t request_store_add(req_store_t * req_store, zframe_t * address,
			  json_t * request);

//doesn't delete the address frame
void request_store_delete(req_store_t * req_store, int32_t id);

req_t *request_store_req(req_store_t * req_store, int32_t id);

#endif
