cmake_minimum_required (VERSION 2.8)
    project (nestedGraphView)

    set (CMAKE_CXX_FLAGS "-g -Wall")
    set (CMAKE_C_FLAGS "-DTHREADED -g -Wall")

    
    
    add_executable (broker_server
	    broker.c
	    request_store.c
	    )

    target_link_libraries (broker_server jansson czmq zmq)
