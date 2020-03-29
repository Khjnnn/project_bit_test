<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
	<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<style type="text/css">
.dot {overflow:hidden;float:left;width:12px;height:12px;background: url('http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/mini_circle.png');}    
.dotOverlay {position:relative;bottom:10px;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;float:left;font-size:12px;padding:5px;background:#fff;}
.dotOverlay:nth-of-type(n) {border:0; box-shadow:0px 1px 2px #888;}    
.number {font-weight:bold;color:#ee6152;}
.dotOverlay:after {content:'';position:absolute;margin-left:-6px;left:50%;bottom:-8px;width:11px;height:8px;background:url('http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white_small.png')}
.distanceInfo {position:relative;top:5px;left:5px;list-style:none;margin:0;}
.distanceInfo .label {display:inline-block;width:50px;}
.distanceInfo:after {content:none;}
</style>
<meta charset="UTF-8">
<title>Insert title here</title>

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=78d603c9ceea19aeba68479415b917d4"></script>

</head>
<body>
	<h1 align='center'>시설지도 페이지 입니당</h1>

	<h1>geolocation을 이용한 위도와 경도 찾기</h1>

	<button onclick="findLocation()">현재 위치의 위도와 경도</button>
	<p id="myLocation"></p>
	<p id="moveLocation"></p>

	<script src="http://code.jquery.com/jquery-1.11.0.js"></script>
	
	
	<script>	
	function findLocation() {
		navigator.geolocation.getCurrentPosition(function(pos) {
			console.log("현위치");
			$('#latitude').html(pos.coords.latitude);     // 위도 
            $('#longitude').html(pos.coords.longitude); // 경도
		})
	}		
	</script>
    <ul>
        <li>위도:<span id="latitude"></span></li>
        <li>경도:<span id="longitude"></span></li>
    </ul>
    <input id="btnStart" type="button" value="시작" />
    <input id="btnStop" type="button" value="감시를 끝낸다" />
    <input id="btnTest1" type="button" value="테스트 1" />
    <input id="btnTest2" type="button" value="테스트 2" />
    <input id="btnTest3" type="button" value="테스트 3" />
    <input id="btnTest4" type="button" value="테스트 4" />
    <div id="map" style="width:100%;height:350px;"></div>  
	<script src="/resources/js/mapPoint.js" type="text/javascript"></script>
	<p>
    <em>지도를 마우스로 클릭하면 선 그리기가 시작되고<br>오른쪽 마우스를 클릭하면 선 그리기가 종료됩니다</em>
	</p>
	
</body>

</html>