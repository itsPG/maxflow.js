#Maxflow.js

An implementation of maxflow in JavaScript.

check index.html to see the demo of maxflow.js

Or see the [Online Demo](http://itspg.org/demo/maxflow/)

## Source

The core of maxflow.js is in maxflow.js

## Usage

### 1. Load maxflow.js

	var maxflow_core = require("./maxflow.js");

### 2. Init a graph

	var flow = maxflow_core(5);
	// init a graph with 5 nodes

### 3. Set edges by giving an array

the element of this array should be like [from, to, capability, unit cost]

	flow.set_edges([
		[0, 2, 10, 3],
		[0, 3, 10, 5],
		[2, 3, 1, 100],
		[2, 1, 10, 7],
		[3, 1, 10, 11],
	]);

### 4. Set source and sink, and go.

	var result = flow.go(0, 1);
	// Start the flow algorithm. Set the #0 node as source and the #1 as sink. 

### 5. Check the path_history (if needed)

	console.log(flow.core.path_history);
	// You may check .core.path_history to see the details.

## License

Copyright (C) PG Tsai 2013

Released under the MIT license.

## Thanks

Thanks to jsplumb as a great GUI implementation.

The only one drawback is the speed though.