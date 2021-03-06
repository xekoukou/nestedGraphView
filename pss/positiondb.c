/*
    Copyright contributors as noted in the AUTHORS file.
                
    This file is part of PLATANOS.

    PLATANOS is free software; you can redistribute it and/or modify it under
    the terms of the GNU Affero General Public License as published by
    the Free Software Foundation; either version 3 of the License, or
    (at your option) any later version.
            
    PLATANOS is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
        
    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

#include<leveldb/c.h>
#include<string.h>
#include"positiondb.h"
#include<stdlib.h>
#include<stdio.h>

void positiondb_init(positiondb_t ** positiondb)
{
	*positiondb = malloc(sizeof(positiondb_t));

	char *errptr = NULL;

	leveldb_options_t *options = leveldb_options_create();
	leveldb_options_set_create_if_missing(options, 1);

	(*positiondb)->options = options;

	leveldb_readoptions_t *readoptions = leveldb_readoptions_create();
	(*positiondb)->readoptions = readoptions;
	leveldb_writeoptions_t *writeoptions = leveldb_writeoptions_create();
	(*positiondb)->writeoptions = writeoptions;

	leveldb_writeoptions_set_sync(writeoptions, 1);

	(*positiondb)->db = leveldb_open(options, "./positiondb", &errptr);
	if (errptr) {
		printf("\n%s", errptr);
		exit(1);
	}
}

//needs a few seconds to close
//put a sleep after it
void positiondb_close(positiondb_t * positiondb)
{
	leveldb_close(positiondb->db);

}

void positiondb_insert_pos_id(positiondb_t * positiondb, pos_id_t * pos_id)
{

	char *errptr = NULL;

	leveldb_put
	    (positiondb->db,
	     positiondb->writeoptions, (const char *)&(pos_id->id),
	     sizeof(int64_t), (const char *)pos_id, 2 * sizeof(int64_t),
	     &errptr);

	if (errptr) {
		printf("\n%s", errptr);
		exit(1);
	}

}

void positiondb_delete_pos_id(positiondb_t * positiondb, int64_t id)
{

	char *errptr = NULL;
	leveldb_delete(positiondb->db, positiondb->writeoptions,
		       (const char *)&id, sizeof(int64_t), &errptr);

	if (errptr) {
		printf("\n%s", errptr);
		exit(1);
	}
}

void positiondb_get_pos_id(positiondb_t * positiondb, int64_t id,
			   pos_id_t * pos_id)
{

	char *errptr = NULL;
	size_t vallen;
	char *value;

	value = leveldb_get(positiondb->db,
			    positiondb->readoptions,
			    (const char *)&id,
			    sizeof(int64_t), &vallen, &errptr);

	if (errptr) {
		printf("\n%s", errptr);
		exit(1);
	}

	memcpy(pos_id, value, vallen);
	pos_id->id = id;
	free(value);

}

//create an iterator and when the iter is invalid ,you finish destroy it
//TODO I need to probably catch the errors
pos_id_t *positiondb_first(leveldb_iterator_t * iter)
{

	leveldb_iter_seek_to_first(iter);
	if (leveldb_iter_valid(iter)) {
		pos_id_t *pos_id = malloc(sizeof(pos_id_t));
		size_t klen = sizeof(int64_t);
		memcpy(&(pos_id->id), leveldb_iter_key(iter, &klen), klen);

		klen = 2 * sizeof(int64_t);
		memcpy(pos_id, leveldb_iter_value(iter, &klen), klen);

		return pos_id;
	} else {
		return NULL;
	}

}

pos_id_t *positiondb_next(leveldb_iterator_t * iter)
{

	leveldb_iter_next(iter);

	if (leveldb_iter_valid(iter)) {
		pos_id_t *pos_id = malloc(sizeof(pos_id_t));
		size_t klen = sizeof(int64_t);
		memcpy(&(pos_id->id), leveldb_iter_key(iter, &klen), klen);

		klen = 2 * sizeof(int64_t);
		memcpy(pos_id, leveldb_iter_value(iter, &klen), klen);

		return pos_id;

	} else {
		return NULL;
	}
}
