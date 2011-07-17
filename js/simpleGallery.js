simpleGalery  = {
	// configuration
	api_key: "a22b1a90b000578e1854ebdb3a3b5ba7",
	photoset_id: "72157625123518541",
	per_page:4,
	// do not touch in these ones
	atualPg:1, 
	limit: 0,
	firstLoad : false,
	
	template:	"<li class=>"+
				"<a onclick=\"javascript:mg.showBigImage('[link]')\" class=\"thumb\" >"+
				"<img src=\"[photo]\" border=\"0\" />"+
				"</a>"+
				"</li>",
	actualNumber: "Exibindo [x] a [y] de [total]",
	init:function(){
		simpleGalery.firstLoad = true;
		simpleGalery.getImage(1);		
	},
	getImage: function(pg){
		$.getJSON("http://api.flickr.com/services/rest/?format=json&jsoncallback=?&api_key="+this.api_key+"&method=flickr.photosets.getPhotos&photoset_id="+this.photoset_id+"&per_page="+this.per_page+"&page="+pg+"&size="+this.size,
			function(data){
				album = data.photoset;
				if (data.stat == "fail") return false;
				photos = album.photo;
				mg.limit = album.total;

				temp = this.template;
				cont = "";
				$.each(photos,function(){
					el = 'http://farm'+this['farm']+'.static.flickr.com/'+this['server']+'/'+this['id']+'_'+this['secret'];
					imgT = el +'_s.jpg';
					imgLinkg = el +'.jpg';
					elem = mg.template	.replace(/\[photo\]/g, imgT)
										.replace(/\[link\]/g, imgLinkg);
					cont += elem;
				});
				$("#thumbPhoto").html(cont)
								.fadeIn();
				
				nd = pg * mg.per_page;
				ndc = nd - mg.per_page +1;
				nd = (nd > mg.limit)? mg.limit: nd;
				act = mg.actualNumber.replace(/\[total\]/, mg.limit)
									.replace(/\[x\]/,ndc)
									.replace(/\[y\]/, nd);
				$("#actualNumber").html(act);
				if(simpleGalery.firstLoad) $(".thumb:first").trigger("click");
				simpleGalery.firstLoad = false;
				
			});	
	},
	goUp: function(){
		m = Math.ceil(mg.limit / mg.per_page);
		a = mg.atualPg;
		if(m > a) {
			$("#thumbPhoto").hide();
			mg.atualPg++;	
			mg.getImage(mg.atualPg);
		}
	},
	goDown: function(){
	
		a = mg.atualPg;
		if(a > 1) {
			mg.atualPg--;	
			mg.getImage(mg.atualPg);
		}
		
	},
	showBigImage: function(data){
		imgG = "<div class=\"photoContainer\"><img src=\""+ data +"\" border=\"0\" /></div>";
		$("#bigPhoto").html(imgG);
		
	}
	
}
mg = simpleGalery;

$().ready(
	function(){
		step1();	
		mg.init(1);
	}
);