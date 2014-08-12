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

#ifndef POSITIONDB_H
#define POSITIONDB_H

//leveldb
#include<leveldb/c.h>
#include"quadtrie-c/quadbit.h"

struct pos_id_t {
	int64_t x;
	int64_t y;
	int64_t id;
        int64_t ancestorId;

};
typedef struct pos_id_t pos_id_t;

typedef struct {
	leveldb_t *db;
	leveldb_options_t *options;
	leveldb_readoptions_t *readoptions;
	leveldb_writeoptions_t *writeoptions;

} positiondb_t;

void positiondb_init(positiondb_t ** positiondb);

//sleep a few seconds after
void positiondb_close(positiondb_t * positiondb);

void positiondb_insert_pos_id(positiondb_t * positiondb, pos_id_t * pos_id);

void positiondb_delete_pos_id(positiondb_t * positiondb, int64_t id);

void positiondb_get_pos_id(positiondb_t * positiondb, int64_t id,
			   pos_id_t * pos_id);

//create an iterator and when the iter is invalid ,you finish destroy it
//TODO I need to probably catch the errors
pos_id_t *positiondb_first(leveldb_iterator_t * iter);

pos_id_t *positiondb_next(leveldb_iterator_t * iter);

#endif
