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
	uint64_t x;
	uint64_t y;
	int64_t id;

};
typedef struct pos_id_t pos_id_t;

typedef struct {
	leveldb_t *db;
	leveldb_options_t *options;
	leveldb_readoptions_t *readoptions;
	leveldb_writeoptions_t *writeoptions;

} localdb_t;

void localdb_init(localdb_t ** localdb);

//sleep a few seconds after
void localdb_close(localdb_t * localdb);

void localdb_insert_pos_id(localdb_t * localdb, pos_id_t pos_id);

//create an iterator and when the iter is invalid ,you finish destroy it
//TODO I need to probably catch the errors
pos_id_t *localdb_first(leveldb_iterator_t * iter);

pos_id_t *localdb_next(leveldb_iterator_t * iter);

#endif
