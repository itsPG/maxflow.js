

var PG_graphic_mincost_maxflow = function()
{
	var r = 
	{
		flowConnector:
		{				
			connector:"StateMachine",
			paintStyle:{lineWidth:3,strokeStyle:"#056"},
			hoverPaintStyle:{strokeStyle:"#dbe300"},
			endpoint:"Blank",
			anchor:"Continuous",
			overlays:
			[
				["PlainArrow", {location:1, width:15, length:12} ],
				//["Label", {label:"test", cssClass:"component label",}]
			]
		},
		flowConnector2:
		{				
			connector:"StateMachine",
			paintStyle:{lineWidth:3,strokeStyle:"#F33"},
			hoverPaintStyle:{strokeStyle:"#dbe300"},
			endpoint:"Blank",
			anchor:"Continuous",
			overlays:
			[
				["PlainArrow", {location:1, width:15, length:12} ],
				//["Label", {label:"test", cssClass:"component label",}]
			]
		},
		mincost_maxflow: 0,
		edge_map: [],
		node_max: 50,
		anime_count: 0,
		last_anime: [],
		node_count: [],
		color_table:
		[
			"#F6CECE", "#F6E3CE", "#ECF6CE", "#CEF6CE", "#CEF6EC", "#CEE3F6", "#CECEF6",
			"#2E64FE", "#2EFEC8", "#00FF40", "#BFFF00", "#FFFF00", "#FFBF00", "#FF8000", "#FF4000",
		],
		init: function(size_in)
		{
			this.mincost_maxflow = PG_mincost_maxflow();
			this.mincost_maxflow.init(size_in);
			this.edge_map = [];
			this.node_max = size_in;
			for (var i = 0; i < this.node_max; i++)
			{
				this.edge_map[i] = [];
			}
			/*
			for (var i = 0; i < this.node_max; i++)
			{
				for (var j = 0; j < this.node_max; j++)
				{
					this.edge_map[i][j] = 0;
				}
			}
			*/

		},
		draw_edge: function(edge_in)
		{
			var s = edge_in[0], t = edge_in[1], cap = edge_in[2], cost = edge_in[3];
			

		},
		set_edge: function(s, t, cap, cost)
		{
			this.mincost_maxflow.set_edge(s, t, cap, cost);

			if (typeof(this.edge_map[s][t]) === "undefined")
			{
				this.edge_map[s][t] = jsPlumb.connect({source:"node"+s, target:"node"+t}, this.flowConnector);
			}
		},
		set_edges: function(edges_in)
		{

			this.mincost_maxflow.set_edges(edges_in);
			for (var k = 0; k < edges_in.length; k++)
			{
				this.set_edge(edges_in[k][0], edges_in[k][1], edges_in[k][2], edges_in[k][3]);
			}
		},
		show_anime_unit: function(tick)
		{

			var history = this.mincost_maxflow.core.path_history;
			if (this.last_anime.length != 0)
			{
				for (var i = 0; i < this.last_anime.length; i++)
				{
					jsPlumb.detach(this.last_anime[i]);
				}
				this.last_anime = [];
				var self = this;
				//setTimeout(function(){self.last_anime = now_anime}, 50);
			}
			if (tick == history.length) return;
			var path = history[tick].path;
			console.log(path);
			for (var i = 0; i < path.length - 1; i++)
			{
				var s = path[i], t = path[i+1];
				var tmp = jsPlumb.connect({source:"node"+s, target:"node"+t}, this.flowConnector2);
				if (s != 0)
				{
					this.node_count[s]++;
					var color = this.color_table[ this.node_count[s]-1 ];
					$("#node"+s).css("background-color", color);
				}
				console.log("connect", s, t);
				this.last_anime.push(tmp);
			}


				var self = this;
				setTimeout(function(){self.show_anime_unit(tick+1)}, 1);
		


		},
		show_anime: function()
		{
			this.anime_count = 0;
			for (var i = 0; i < this.node_max; i++)
			{
				this.node_count[i] = 0;
			}
			this.show_anime_unit(0);
		},
		go: function()
		{
			this.mincost_maxflow.go(0, 49);
			console.log(this.mincost_maxflow.core.path_history);
			$("body").append(this.mincost_maxflow.core.path_history.length);
			this.show_anime();

		},

	}
	return r;
}

/*
	this is the JS for the main jsPlumb demo.  it is shared between the YUI, jQuery and MooTools
	demo pages.
*/

var PG_random = function(a, b)
{
	return Math.floor(a + Math.random()*(b-a)+0.4999);
}

;(function(){

	for (var i = 0; i < 30; i++)
	{
		$("<div>",
		{
			id:"node" + (i + 1), // 1~30 code snippet
			class:"component window",
			width:10,
			height:10,
		}).offset({top:50+Math.floor(i/3)*40, left:250+i%3*40}).appendTo("body");
	}
	for (var i = 0; i < 5; i++)
	{
		$("<div>",
		{
			id:"node" + (i + 41), // 41~45 server
			class:"component window",
			width:40,
			height:40,
		}).offset({top:50+i*80, left:500}).appendTo("body");
	}
	for (var i = 0; i < 10; i++)
	{
		$("<div>",
		{
			id:"node" + (i + 61), // 61~70 middle 
			class:"component window",
			width:20,
			height:20,
		}).offset({top:50+i*40, left:600}).appendTo("body");
	}
	$("<div>", {id:"node0", class:"component window", width:100, height:100})
	.offset({top:200, left:50}).appendTo("body");
	$("<div>", {id:"node49", class:"component window", width:100, height:100})
	.offset({top:200, left:750}).appendTo("body");
	

})();
;(function() {

	window.jsPlumbDemo = {
			
		init : function() {			

			jsPlumb.importDefaults({
				DragOptions : { cursor: "pointer", zIndex:2000 },
				HoverClass:"connector-hover"
			});



			
			// make all .window divs draggable. note that here i am just using a convenience method - getSelector -
			// that enables me to reuse this code across all three libraries. In your own usage of jsPlumb you can use
			// your library's selector method - "$" for jQuery, "$$" for MooTools, "Y.all" for YUI3.
			jsPlumb.draggable(jsPlumb.getSelector(".window"), { containment:".demo"});    

		}
	};	
})();

jsPlumb.ready(function()
{

	//return;
	var FLOW = PG_graphic_mincost_maxflow();
	FLOW.init(80);

	var flowConnector = {				
		connector:"StateMachine",
		paintStyle:{lineWidth:3,strokeStyle:"#056"},
		hoverPaintStyle:{strokeStyle:"#dbe300"},
		endpoint:"Blank",
		anchor:"Continuous",
		overlays:
		[
			["PlainArrow", {location:1, width:15, length:12} ],
			//["Label", {label:"test", cssClass:"component label",}]
		]
	};
	var flowConnector_highlight = {				
		connector:"StateMachine",
		paintStyle:{lineWidth:3,strokeStyle:"#F33"},
		hoverPaintStyle:{strokeStyle:"#dbe300"},
		endpoint:"Blank",
		anchor:"Continuous",
		overlays:
		[
			["PlainArrow", {location:1, width:15, length:12} ],
			//["Label", {label:"test", cssClass:"component label",}]
		]
	};
	jsPlumb.registerConnectionTypes({
    "basic": flowConnector,
    "highlight": flowConnector_highlight,
	});

	for (var i = 0; i < 30; i++)
	{
		FLOW.set_edge(0, i+1, 1, 1);
		if (Math.random() > 0.8) FLOW.set_edge(i+1, 41, 1, 1);
		if (Math.random() > 0.6) FLOW.set_edge(i+1, 42, 1, 1);
		if (Math.random() > 0.4) FLOW.set_edge(i+1, 43, 1, 1);
		if (Math.random() > 0.2) FLOW.set_edge(i+1, 44, 1, 1);
		if (Math.random() > 0.0) FLOW.set_edge(i+1, 45, 1, 1);
	}

	for (var i = 0; i < 5; i++)
	{
		FLOW.set_edge(i+41  , i*2+61, 4 , 1);
		FLOW.set_edge(i*2+61, 49    , 4 , 10+i*3);
		FLOW.set_edge(i+41  , i*2+62, 7, 1);
		FLOW.set_edge(i*2+62, 49    , 7, 20+i*3);

	}
	FLOW.go();
	return;
});
