cmake_minimum_required (VERSION 2.8)
    project (nestedGraphView)

    set (CMAKE_CXX_FLAGS "-g -Wall")
    set (CMAKE_C_FLAGS "-DTHREADED -g -Wall")

    add_subdirectory (quadtrie-c)
    
    include_directories ("${PROJECT_SOURCE_DIR}/quadtrie-c")
    
    add_executable (position_server
	    positiondb.c
	    position_server.c
	    )

    target_link_libraries (position_server leveldb jansson czmq quadbit)
