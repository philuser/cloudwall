(function(){
	$("#cw-space")
	.my(
		{
	"id": "cw.Sys.Profile.Create",
	"error": "Could not decrypt settings file",
	"init": function ($o, form) {

	var db, that=this, pi=$.Deferred(), _isnew=true, _settings = cw.crypto._settings;

	that.Pouch = PouchDB;
	that.Settings = _settings;
	form.data.isnew = _isnew;

	db = new PouchDB("cw", function(e,r){
		if (!e) {
			console.log("##### Connected to DB #####", db);
			_new({})
		} else pi.reject("Can’t start DB, may be your browser is too old or whatever.")

			});
	return pi.promise();

	//- - - - - - - - - - - - - - - - - 

	function _new(doc){
		$.extend(true, form.data.doc, doc);

		that.db = db;
		if (!form.data.doc.uid) form.data.doc.uid=cw.lib.hash8(Date.now()+Number.random(1e30));
		$o.formgen(that.HTML);
		$o.find("#abouttext").html(that.Intro);
		pi.resolve();
	}
		
		},
	"Intro": "<h3 class=\"mt0 xgray\">Welcome!</h3> \n<p class=\"lh170\">\n\tNo user profile found on this device.\n\tPlease, provide data for creating your local profile.\n</p>\n<p class=\"lh170\">\n\tPIN better be short – CloudWall will ask to enter it on every start.\n</p>\n\n<h3 class=\"xgray\">Connect to profile</h3>\n<p class=\"lh170\">\n\tIf you already have CouchDB, that holds your CloudWall account from other device –\n\tyou can <span class=\"pseudolink btn-link\">link accounts</span>.\n</p>",
	"IntroExt": "<p class=\"lh170 mt-5\">\n\tConnecting to external DB will sync this browser’s local databases \n\twith external account. Sync destroys all existing local \n\tCloudWall DBs if any – with no rollback possible.\n</p>\n<p class=\"\">\n\tPlease note that full account sync may take significant time.\n</p>",
	"params": {
		"animate": 100,
		"effect": function ($e, onoff, duration) {

			if (onoff) { $e.slideDown(duration); return; }
			$e.slideUp(duration);
		
			}
	},
	"Dbs": ["sysmanual"],
	"ui": {
		"#dburl": {
			"bind": "dburl",
			"check": function (d,v) {

			if (!v.length) return "";
			if (!/^http[s]?:\/\/.+/.test(v)) return "URL required";
			if (!/^http[s]?:\/\/[a-z0-9\-]{1,63}(\.[a-z0-9\-]{1,63}){1,5}/.test(v)) 
				return "Invalid domain";
			if (!/.+\/[a-zA-Z0-9_\-\(\)]{1,200}$/.test(v)) return "No DB name provided";
			return "";
		
				}
		},
		"#dblogin": {
			"bind": "dblogin"
		},
		"#dbpwd": {
			"bind": "dbpwd"
		},
		"#btn-connect": {
			"delay": 50,
			"bind": function (d,v, $o) {

		var that = this,
				db = this.db, 
				edb,
				url, 
				creds = "";
		if (v!=null && $o.my().root.my("valid") ) {
			if (!d.dburl) return;
			if (d.dbpwd+d.dblogin && (!d.dbpwd || !d.dblogin)) {
				cw.lib.note("Both login and password required.");
				return;
			}
			creds = d.dblogin?d.dblogin+":"+d.dbpwd+"@":"";
			url = d.dburl.replace(/^(http[s]?:\/\/)(.+)$/,"$1"+creds+"$2");

			console.log("Trying to connect remote DB...")

			//try to connect
			edb = new this.Pouch(url, function (e,res) {
				var msg;
				if (e) {
					msg=e.message;
					console.log(e)
					if (!msg) _fail("Can’t connect to DB.");
					else if (msg==="missing") _fail("DB does not exist.");
					else if (/not\sauth/.test(msg)) _fail("Authorization required.");
					else if (/or\spass/.test(msg)) _fail("Name or password are incorrect.");
					else _fail("Error connecting to DB.")
						}
				else {
					edb.get("cw", function (e,res) {
						var msg;
						if (e) {
							msg=e.message;
							if (!msg) _fail("Can’t connect to DB.");
							else if (msg==="missing") _fail("DB or account does not exist.");
							else if (/not\sauth/.test(msg)) _fail("Invalid credentials.");
							else _fail("Error reading account.")
								} else {
									console.log("Read remote cw", res)
									_process(res);
								}
					});
				}
			});

		}

		function _process (doc){
			if (!d.isnew && d.doc) {
				//delete all dbs
				var dbs = d.doc.dbs.map(function(e){return e.name});
				console.log(dbs);
				cw.crypto.init(doc)
				.then(function(){
					//delete dbs
					$.my.modal({
						manifest:that.Confirm,
						data:{
							text:"Delete local DBs "+dbs.join(", ")+"?",
							ok:"Proceed"
						}
					})
					.then(function(r){
						var db,
								d1 = that.Settings(),
								d2 = cw.crypto.enc(d1);
						var _done = (function(){
							_create();
						}).after(dbs.length);
						if (Object.isObject(r)) {
							dbs.forEach(function(e){
								that.Pouch.destroy(e, _done);
							});
						} else _fail("Cancelled.");
						function _create(){
							console.log("Creating account doc...")
							db = new that.Pouch("cw", function(){										
								$.my.modal(
									'<div class=" pt20 pb15 w350 tac blue">'
									+'Reloading account, it can take a time. '
									+'<br>Please, wait.'
									+'<br><div class="cw-busy w50 mt10"></div>'
									+'</div>'
									,function(){},500);

								db.replicate.from (url, {
									complete:function (e, res){
										console.log("Replication ", e,res);
										window.location.replace("./");
									}
								});
							});
						}
					})
					.fail(function(){
						_fail("Cancelled.")
					});
				})
				.fail(function(){
					_fail("Invalid PIN for received account.")
				});
			} else {
				//load doc and save
				db = new that.Pouch("cw", function(){

					$.my.modal(
						'<div class=" pt20 pb15 w350 tac blue">'
						+'Loading account, it can take a time. '
						+'<br>Please, wait.'
						+'<br><div class="cw-busy w50 mt10"></div>'
						+'</div>'
						,function(){},500);


					db.replicate.from (url, {
						complete:function (e, res){
							console.log("Replication ", e,res);
							window.location.replace("./");
						}
					});
				});
			}
		}

		function _fail(msg){
			cw.lib.note(msg, "error");
		}
	
				},
			"events": "click.my"
		},
		"#aboutLink": {
			"bind": function () {

			return this.IntroExt;
		
				}
		},
		"#pic": {
			"bind": function (d,v, $o) {

			if (v!=null) {
				$.my.modal({
					manifest:this.Cropper,
					data:{data:"",filename:""}
				}).then(function (crop) {
					if (crop && crop.data) {
						d.doc.pic="data:image/jpeg;base64,"+crop.data;
						$o.trigger("recalc");
						crop.data="";
					}
				});
			}
			return d.doc.pic;
		
				},
			"events": "click.my"
		},
		"#name": {
			"bind": "doc.name",
			"check": /^(|[a-z0-9]{3,40})$/i,
			"error": "3–40 latins and nums",
			"recalc": "#pin",
			"css": {
				":disabled": function (d) {
					return !d.isnew
					}
			}
		},
		"#contact": {
			"bind": "doc.contact",
			"check": /^.{0,60}$/,
			"error": "60– chars"
		},
		"#pin": {
			"bind": "pin"
		},
		"#btn-create": {
			"delay": 50,
			"bind": function (d,v, $o) {

		var i, db, d2, that=this, uname = d.doc.name+"-"+d.doc.uid;
		if (v!=null && $o.my().root.my("valid") && this.db) {
			if (cw.lib.sdbm($o.my("find","#pic").attr("src"))=="79adusu9") {
				cw.lib.note("Please change userpic","error");
			}
			else {

				if (d.isnew) {
					d.doc.pin = _pin();
					d.doc.dbs[0].creator = uname;
					
					/*console.log(that.Dbs);
					for (i=1;i<d.doc.dbs.length;i++) {
						if (that.Dbs.indexOf(d.doc.dbs[i].name)==-1) d.doc.dbs[i] = null;
					}*/
					
					d.doc.dbs = d.doc.dbs.compact(true);
					
					d.doc.keys = d.doc.keys.map(function(e){
						e.emitter=uname; 
						e.link=d.doc.contact;
						return e;
					});
				} else if (d.pin) d.doc.pin = _pin();
				
				console.log(d.doc);

				try{cw.crypto.enc(d.doc)}
				catch(e) {console.log(e.message, e.stack, e);}

				if (d.isnew) {							

					$.my.modal(
						'<div class=" pt20 pb15 w350 tac blue">'
						+'Loading system apps, it can take a time. '
						+'<br>Please, wait.'
						+'<br><div class="cw-busy w50 mt10"></div>'
						+'</div>'
						,function(){},500);

					// Read app list

					$.ajax({ url:"sys/apps.json", type:"GET", dataType:"json", cache:false })
					.then(function(a){
						var b, i, j, o;
						if (!Object.isArray(a) || !a.length) {
							$.my.modal();
							cw.lib.note("Oops, server responded with error. Please retry in 5-10 minutes.", "error", 5000);
							console.log(a);
						}
						else {
							b = Object.clone(a.filter(function(e){return Object.isObject(e)}), !0);
							for (var i=0;i<b.length;i++) {
								o=b[i];
								o.srcrev = o._rev;
								delete o._rev;
								if (o._attachments) for (j in o._attachments) {
									o._attachments[j] = Object.select(o._attachments[j],["content_type","data"]);
								}
							}
							// encrypt settings doc
							b.push(cw.crypto.enc(d.doc));
							that.db.bulkDocs({docs:b})
							.then(
								function(a){
									// everything is ok, reload page	
									$.my.modal();
									cw.lib.note("Account created, reloading page.", "ok", 5000);
									//window.location.replace("./index.html#sysmanual/List");
									window.location.hash="sysmanual/List";
									window.location.reload();
								},
								function(a){
									$.my.modal();
									cw.lib.note("Saving account info and apps failed. Try again, please.", "error", 5000);
									console.log(a);
								}
							)
						}
					})
					.fail(function(e){
						$.my.modal();
						cw.lib.note("Error loading apps. Try again, please.", "error", 5000);
						console.log(e);
					});

				} else {

					this.db.put(cw.crypto.enc(d.doc), function (){
						window.location.reload();
					});

				}
			}

		}

		function _pin() {
			return cw.lib.md5(cw.lib.md5(cw.lib.md5(d.pin)+cw.lib.hash8(d.pin))+d.doc.name);
		}
	
				},
			"events": "click.my",
			"watch": "#name",
			"css": {
				":disabled": function (d) {
					return !d.doc.name || !/^(|[a-z0-9]{3,40})$/i.test(d.doc.name)
					}
			}
		},
		"input[name=\"dbs\"]": {
			"bind": "this.Dbs"
		},
		".btn-link": {
			"bind": function (d,v,$o) {

			if (v!=null) {
				$o.my("find",".slide").slideToggle(200);
			}
		
				},
			"events": "click.my"
		}
	},
	"data": {
		"isnew": true,
		"dburl": "",
		"dbpwd": "",
		"dblogin": "",
		"prevpin": "",
		"pin": "",
		"doc": {
		}
	},
	"Confirm": {
		"id": "cw.Sys.Confirm",
		"init": function ($o, form) {

		var d=form.data;
		$o.formgen([
			'<div class="'+d.css+'">'+d.text+'</div>',
			{label:"70px", row:"350px", rowCss:"my-row mt15 pt15 fs90 mb-5 xgray btd"},
			['', 'btn#btn-ok.green.mr5',{val:d.ok}, 
			 'btn#btn-cancel',{val:d.cancel}]
		]);
	
			},
		"params": {
			"delay": 20,
			"strict": true,
			"width": 350
		},
		"data": {
			"text": "",
			"css": "xgray",
			"ok": "Ok",
			"cancel": "Cancel"
		},
		"ui": {
			"#btn-ok": {
				"bind": function (d,v,$o) {

				if (v!=null) {
					$o.trigger("commit");
				}
			
					},
				"events": "click"
			},
			"#btn-cancel": {
				"bind": function (d,v,$o) {

				if (v!=null) {
					$o.trigger("cancel");
				}
			
					},
				"events": "click"
			}
		}
	},
	"HTML": ["<div id=\"cw-reg\" class=\"w600 vat dib tal\" style=\"margin:0px auto 100px auto\">",
		"<div id=\"left\" class=\"w250 dib vat pr50\">",
		{
			"row": "200px",
			"rowCss": "my-row pb10 tac"
		},
		"<div class=\"slide\">",
		"<img id=\"pic\" src=\"\" style=\"width:200px;height:200px;cursor:pointer\" class=\"db mb15 br4\">",
		["",
			"inp#name.w200.fs130.tac",
			{
				"plc": "Login",
				"title": "Can not be changed later, be careful!",
				"autocorrect": "off",
				"autocapitalize": "off",
				"autocomplete": "off"
			},
			"msg"],
		["",
			"inp#contact.w200.fs110.tac",
			{
				"plc": "@twi or email",
				"title": "Stored locally, published as your contact info only when you connect to external DB.",
				"autocorrect": "off",
				"autocapitalize": "off",
				"autocomplete": "off"
			}],
		["",
			"inp#pin.w200.fs110.tac",
			{
				"plc": "PIN code",
				"title": "Every time you log in \nCloudWall will ask you to enter PIN.\nLeave blank to skip PIN reenter.",
				"autocorrect": "off",
				"autocapitalize": "off",
				"autocomplete": "off"
			}],
		["",
			"btn#btn-create.w180.fs100.tac.mt10.mb20",
			{
				"val": "Create profile",
				"style": "border-radius:100px"
			}],
		"</div>",
		"<div class=\"slide\" style=\"display:none\">",
		["",
			"txt#dburl.w200.fs90.pb5",
			{
				"rows": 5,
				"plc": "URL of external CouchDB, which holds your account replica"
			},
			"msg"],
		["",
			"inp#dblogin.w200.fs110.tac",
			{
				"plc": "DB login",
				"autocorrect": "off",
				"autocapitalize": "off",
				"autocomplete": "off"
			}],
		["",
			"inp#dbpwd.w200.fs110.tac",
			{
				"plc": "DB password",
				"autocorrect": "off",
				"autocapitalize": "off",
				"autocomplete": "off"
			}],
		["",
			"btn#btn-connect.w120.fs100.tac.mt10.mb20",
			{
				"val": "Connect",
				"style": "border-radius:100px"
			},
			"<br>",
			"spn.btn-link.pseudolink.ml10.fs80",
			{
				"txt": "Or create new..."
			}],
		"</div>",
		"</div>",
		"<div id=\"right\" class=\"w350 dib vat\">",
		"<div class=\"fs85 gray slide\" id=\"about\">",
		"<div class=\"w350\" id=\"abouttext\"></div>",
		"</div>",
		"<div class=\"fs90 gray slide\" style=\"display:none\" id=\"aboutLink\"></div>",
		"</div>",
		"</div>"],
	"Cropper": {
		"init": function ($o, form) {

		var html = $.my.formgen([
			'<div class="fl mr20 tac vat bg-lgray" style="width:600px;height:450px;'
			+'overflow:hidden;position:relative;line-height:450px;" id="crop-frame">',
			'<img id="source" class="vam" style="max-width:600px; max-height:450px; background:white" src="" />',
			'<div class="w600  dib" style="height:450px;position:absolute;top:0;left:0">',
			'<span class="dib vam fs110 button">',
			'<span class="fi-photo"><span class="fs110"> &nbsp;Select Image</span></span>',
			'</span>',
			'<input type="file" id="file" class="w600 dib" accept="image/jpeg,image/png" '
			+'style="height:450px;cursor:pointer;opacity:0; position:absolute;top:0;left:0">',
			'</div>',
			'</div>',
			'<div class="w200 dib vat" id="xpreview">',
			'<canvas id="preview" class="bg-lgray" style="width:200px;height:200px" width='
			+form.data.size+' height='+form.data.size+' style="overflow:hidden;"></canvas>',
			{row:"200px",rowCss:"mt10 pt15 btd fs90 tac"},
			["","btn#btn-apply.mr5.green",{val:"Apply"}, "btn#btn-close.mr0",{val:"Cancel"}],
			'</div>',
			'<div class="w200 dib vat" id="xwarn">',		
			'</div>',
			'<div class="hide"><canvas id="x2" width='+form.data.size*2+' height='+form.data.size*2+'></canvas></div>'
		]);
		$o.html(html);
	
			},
		"params": {
			"strict": true,
			"width": 820
		},
		"data": {
			"filename": "",
			"data": "",
			"cropped": false,
			"size": 200
		},
		"style": {
			" .jcrop-holder": "display:inline-block;vertical-align:middle"
		},
		"ui": {
			"#file": {
				"bind": function (d, v, $o) {


				var f,
						$r = $o.my().root,
						$c = $r.find("#preview"),
						$img = $r.find("#source"),
						$c2 = $r.find("#x2"),
						n={k:1}, img="";


				if (v!=null && v) {
					f = $o[0].files[0];
					if (f) (function(){
						d.filename = f.name;

						var fr = new FileReader(), ri, sb64 = [];
						fr.onload=function(e){
							ri = new Uint8Array(e.target.result);
							for (var i=0; i<ri.length; i++) sb64.push(String.fromCharCode(ri[i]));
							img = window.btoa(sb64.join(""));
						};

						fr.onloadend = function (){
							$img.load(function(){
								n.k = $img[0].naturalWidth/$img.width();
							});
							$img.removeClass("hide")
							.attr("src","data:image/jpeg;base64,"+img);

							n.k=$img[0].naturalWidth/$img.width();	
							$img.Jcrop({
								onChange: preview,
								onSelect: preview.debounce(20),
								aspectRatio: 1,
								allowMove:true
							}, function (){
								this.animateTo([100,100,300,300]);
							});
							img="";
							$o.parent().addClass("hide");

						};
						fr.readAsArrayBuffer(f);	
					})();
				}

				function preview (c){
					if(parseInt(c.w) > 0) {
						// Show image preview
						var img = $img[0], cs, ctx, cs2, ctx2, 
								k = n.k,
								w = c.w*k; //width to scale in 200px
						if (w>d.size*2) {
							// double downsample to remove
							// bilinear-scaler artifacts
							cs2 = $c2[0];
							ctx2 = cs2.getContext("2d");
							ctx2.fillStyle="white";
							ctx2.fillRect(0,0,d.size*2, d.size*2);
							ctx2.drawImage(img, c.x*k, c.y*k, w, w, 0, 0, d.size*2, d.size*2);
							cs = $c[0];
							ctx = cs.getContext("2d");
							ctx.drawImage(cs2, 0, 0, d.size*2, d.size*2, 0, 0, d.size, d.size);
						} else {
							cs = $c[0];
							ctx = cs.getContext("2d");
							ctx.fillStyle="white";
							ctx.fillRect(0,0,d.size, d.size);
							ctx.drawImage(img, c.x*k, c.y*k, w, w, 0, 0, d.size, d.size);
						}
						d.cropped=true;
					}
				}
			
					}
			},
			"#btn-apply": {
				"bind": function (d,v,$o) {

				if (v!=null && d.cropped) {
					d.data = $o.my().root.find("#preview")[0]
					.toDataURL('image/jpeg',0.93)
					.substr(23);
					$o.my().root.trigger("commit");
				}
			
					},
				"events": "click.my"
			},
			"#btn-close": {
				"bind": function (d,v,$o) {
					if (v!=null) $o.my().root.trigger("cancel");
					},
				"events": "click.my"
			}
		}
	},
	"style": {
		" h3": "margin:20px 0 12px 0;",
		" p": "margin: 0.2em 0 0.7em 0;"
	}
},
		{doc: ({
	_id:"cw",
	type:"settings",
	stamp:Date.now(),

	name:"",
	pin:"",
	uid:"",
	contact:"",

	crypto:"PIN",

	tags:{},
	"keys": [
		{
			"id": cw.lib.hash8(Number.random(-1e13,1e13)+Date.now()+""),
			"key": cw.lib.key16(Number.random(-1e13,1e13)),
			"stamp": Date.now(),
			"name": "Secret",
			"emitter": "",
			"link": "",
			"desc": "Local secret key",
			"local": true,
			"shared": []
		},
		{
			"id": cw.lib.hash8(Number.random(-1e13,1e13)+Date.now()+""),
			"key": cw.lib.key16(Number.random(-1e13,1e13)),
			"stamp": Date.now(),
			"name": "Default public key",
			"emitter": "",
			"link": "",
			"desc": "Public key",
			"local": false,
			"shared": []
		}
	],
	dbs:[
		{
			"name": "cw",
			"title": "System DB",
			"desc":"This DB contains user profile info, several system apps, trust settings and info about read revisions of docs.",
			"pic": "",
			"ico": "data:image/png;base64,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",
			"sync": [],
			"start": "List/!eyJtb2RlIjogWyJjb2x1bW5zLWJyaWVmIl0sInNlYXJjaCI6ICIiLCJzb3J0IjogWyJUeXBlIl19",
			"apps": [],
			"creator": "",
			"stamp": Date.now()
		},
		{
			"name": "sysmanual",
			"title": "Demo & Docs",
			"pic": "",
			"ico": "data:image/png;base64,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",
			"sync": [
				{
					"url": "https://cloudwall.smileupps.com/cwmanual",
					"dir": ["from"],
					"interval":"1440"
				}
			],
			"start": "List/!eyJtb2RlIjogWyJncmlkLW1lZGl1bSJdLCJzZWFyY2giOiAiIiwic29ydCI6IFsiVHlwZSJdfQ--",
			"apps": [
				{
					"name": "Settings",
					"title": "Settings",
					"url": "Sys.Db.Settings/!eyJuYW1lIjogIiJ9/!eyJuYW1lIjogInN5c21hbnVhbCJ9",
					"ico": ""
				}
			],
			"creator": "ermouth",
			"stamp": 1428110213478
		}
	],
	pic:"data:image/jpeg;base64,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"
}) }
	)
	.fail(function (msg){
		cw.lib.note(msg, "error")
	});
	
})();