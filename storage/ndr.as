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
		private function setData(data:Object, name:String = null):String {
			var localName:String = "ndr" + (name ? ("_" + name) : "");
			var so:SharedObject = SharedObject.getLocal(localName);
			so.data["data"] = data;
			return so.flush();
		}
		private function getData(name:String = null):Object {
			var localName:String = "ndr" + (name ? ("_" + name) : "");
			var so:SharedObject = SharedObject.getLocal(localName);
			return so.data["data"];
		}
	}
}
