package {
	import flash.display.Sprite;
	import flash.system.Security;
	import flash.external.ExternalInterface;
	import flash.net.SharedObject;
	public class ndr extends Sprite
	{
		public function ndr()
		{
			Security.allowDomain("www.nicovideo.jp");
			var host:String = ExternalInterface.call("function(){return location.host}");
			var path:String = ExternalInterface.call("function(){return location.pathname}");
			if (host == "www.nicovideo.jp" && path == "/ndr/") {
				ExternalInterface.addCallback("getData", getData);
				ExternalInterface.addCallback("setData", setData);
			}
		}
		private function setData(key:String, data:Object = null, name:String = null):String {
			if (arguments.length == 1) {
				data = key;
				key = "data";
			}
			var localName:String = "ndr" + (name ? ("_" + name) : "");
			var so:SharedObject = SharedObject.getLocal(localName);
			so.data[key] = data;
			return so.flush();
		}
		private function getData(key:String = null, name:String = null):Object {
			if (arguments.length == 0) {
				key = "data";
			}
			var localName:String = "ndr" + (name ? ("_" + name) : "");
			var so:SharedObject = SharedObject.getLocal(localName);
			return so.data[key];
		}
		private function clear(name:String = null):void {
			var localName:String = "ndr" + (name ? ("_" + name) : "");
			var so:SharedObject = SharedObject.getLocal(localName);
			so.clear();
		}
	}
}
