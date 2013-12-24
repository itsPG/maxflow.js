/*
	Maxflow.js
	Copyright (C) 2013, PG Tsai
	Released under the MIT license.

	If there's any bug in it.
	Please report the bug to https://github.com/itsPG/maxflow.js
	Thank you. 

*/

;(function(){var PG_mincost_maxflow_core = function()
{
	var r = 
	{
		origin_cap: [],
		cap: [],
		flow: [],
		weight: [],
		path: [],
		distance: [],
		path_history: [],
		node_max: 100,
		init_graph: function()
		{
			this.origin_cap = [];
			this.cap = [];
			this.flow = [];
			this.weight = [];
			this.path = [];
			this.distance = [];
			this.path_history = [];
			for (var i = 0; i < this.node_max; i++)
			{
				this.origin_cap[i] = [];
				this.cap[i] = [];
				this.flow[i] = [];
				this.weight[i] = [];
				this.path[i] = [];
				this.distance[i] = [];
			}
		},
		set_graph: function(cap_in, cost_in)
		{
			for (var i = 0; i < this.node_max; i++)
			{
				for (var j = 0; j < this.node_max; j++)
				{

					this.origin_cap[i][j] = cap_in[i][j];
					this.weight[i][j] = cost_in[i][j];
				}
			}
			this.reset_cap();
		},
		reset_cap: function()
		{
			this.cap = [];
			for (var i = 0; i < this.node_max; i++)
			{
				this.cap[i] = [];
			}
			for (var i = 0; i < this.node_max; i++)
			{
				for (var j = 0; j < this.node_max; j++)
				{
					this.cap[i][j] = this.origin_cap[i][j];
				}
			}
		},
		clear_flow: function()
		{
			this.flow = [];
			for (var i = 0; i < this.node_max; i++)
			{
				this.flow[i] = [];
			}
			for (var i = 0; i < this.node_max; i++)
			{
				for (var j = 0; j < this.node_max; j++)
				{
					this.flow[i][j] = 0;
				}
			}
		},
		clear: function()
		{
			this.init_graph();
		},
		warshall: function(s, t)
		{
			for (var i = 0; i < this.node_max; i++)
			{
				for (var j = 0; j < this.node_max; j++)
				{
					this.path[i][j] = j;
					this.distance[i][j] = Infinity;
				}
			}
			for (var i = 0; i < this.node_max; i++)
			{
				this.distance[i][i] = 0;
			}
			for (var i = 0; i < this.node_max; i++)
			{
				for (var j = 0; j < this.node_max; j++)
				{
					if (this.flow[i][j] < this.cap[i][j])
					{
						this.distance[i][j] = Math.min(this.distance[i][j], this.weight[i][j]);
					}
					if (this.flow[j][i] > 0)
					{
						this.distance[i][j] = Math.min(this.distance[i][j], this.weight[j][i]);
					}
				}
			}
			
			for (var k = 0; k < this.node_max; k++)
			{
				for (var i = 0; i < this.node_max; i++)
				{
					for (var j = 0; j < this.node_max; j++)
					{
						if (this.distance[i][k] + this.distance[k][j] < this.distance[i][j])
						{
							this.distance[i][j] = this.distance[i][k] + this.distance[k][j];
							this.path[i][j] = this.path[i][k];
						}
					}
				}
			}
			return this.distance[s][t] < Infinity;
		},
		mincost_maxflow: function(s, t)
		{

			this.clear_flow();
			var flow_ans = 0, cost_ans = 0;

			//console.log(this.flow, this.cap);
			//console.log(this.distance, this.weight);

			while (this.warshall(s, t))
			{
				var flow_tmp = Infinity, cost_tmp = 0, path_tmp = [];
			
				for (var i = s, j = this.path[s][t]; i != j; j=this.path[i=j][t])
				{
					flow_tmp = Math.min(flow_tmp, (this.flow[j][i]>0 ? this.flow[j][i] : this.cap[i][j] - this.flow[i][j]));
				}
				path_tmp.push(s);
				for (var i = s, j = this.path[s][t]; i != j; j=this.path[i=j][t])
				{
					path_tmp.push(j);
					if (this.flow[j][i] > 0)
					{
						this.flow[j][i] -= flow_tmp;
						cost_tmp -= this.weight[j][i];
					}
					else
					{
						this.flow[i][j] += flow_tmp;
						cost_tmp += this.weight[i][j];
					}
				}
				this.path_history.push({flow: flow_tmp, path: path_tmp});
				//console.log(this.path_history[this.path_history.length-1]);
				flow_ans += flow_tmp;
				cost_ans += flow_tmp * cost_tmp;
			}
			var ans = {mincost: cost_ans, maxflow: flow_ans};
			//console.log(ans);
			return ans;
		},
	}
	r.init_graph();
	return r;
}
var PG_flow_input = function(size_in)
{
	var r = 
	{
		graph: [],
		cost: [],
		node_max: 5,
		clear_graph: function()
		{
			for (var i = 0; i < this.node_max; i++)
			{
				this.graph[i] = [];
				this.cost[i] = [];
			}
			for (var i = 0; i < this.node_max; i++)
			{
				for (var j = 0; j < this.node_max; j++)
				{
					this.graph[i][j] = 0;
					this.cost[i][j] = Infinity;
				}
			}
		},
		set_edge: function(s, t, cap_in, cost_in)
		{
			this.graph[s][t] = cap_in;
			this.cost[s][t] = cost_in;
			this.cost[t][s] = cost_in;
		}
	}
	r.node_max = size_in;
	r.clear_graph();
	return r;
}

var PG_mincost_maxflow = function(size_in)
{
	var r =
	{
		core: 0,
		graph: 0,

		init: function(size_in)
		{
			this.core = PG_mincost_maxflow_core();
			this.core.node_max = size_in;
			this.graph = PG_flow_input(size_in);
		},
		set_edge: function(s, t, cap_in, cost_in)
		{
			this.graph.set_edge(s, t, cap_in, cost_in);
		},
		set_edges: function(edges)
		{
			for (var i = 0; i < edges.length; i++)
			{
				this.set_edge(edges[i][0], edges[i][1], edges[i][2], edges[i][3]);
			}
		},
		go: function(from, to)
		{
			this.core.set_graph(this.graph.graph, this.graph.cost);
			var result = this.core.mincost_maxflow(from, to);
			console.log(result);
		},
	}
	if (typeof(size_in) != "undefined") r.init(size_in);
	return r;
}

if (typeof(GLOBAL) === "undefined")
{
	window.PG_mincost_maxflow = PG_mincost_maxflow;
}
else
{
	module.exports = PG_mincost_maxflow;
}


}());