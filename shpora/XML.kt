val factory = XmlPullParserFactory.newInstance()
factory.isNamespaceAware = true
val parser = factory.newPullParser()
parser.setInput(StringReader(result))

var cityName = ""
var topTag = ""
var subTag = ""
var dt_txt = ""
var description: String = ""
var icon: String = ""
while (parser.eventType != XmlPullParser.END_DOCUMENT) {
    when (parser.eventType) {
        XmlPullParser.START_TAG -> {
            when (parser.name) {
                "location", "forecast" -> topTag = parser.name
                "name" -> {
                    if(topTag=="location") cityName = parser.nextText()
                }
                "time" -> {
                    if (topTag=="forecast") {
                        subTag = parser.name
                        dt_txt = parser.getAttributeValue(null, "from").toString()
                    }
                }
                "symbol" -> {
                    if(subTag=="time"){
                        description = parser.getAttributeValue(null, "name").toString()
                        icon = parser.getAttributeValue(null, "var").toString()
                    }
                }
            }
        }
        XmlPullParser.END_TAG -> {
            when (parser.name) {
                "time" -> {
                    weatherList.add(
                        Weather(
                            0,
                            0.0,
                            0,
                            icon,
                            description,
                            0.0,
                            0,
                            dt_txt
                        )
                    )
                }
            }
        }
    }
    parser.next()
}
