<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>


</head>
<body>
	<h1 align='center'>시설지도 페이지 입니당</h1>

	<h1>geolocation을 이용한 위도와 경도 찾기</h1>

	<button onclick="findLocation()">현재 위치의 위도와 경도</button>
	<p id="myLocation"></p>
	<p id="moveLocation"></p>

	<script src="http://code.jquery.com/jquery-1.11.0.js"></script>

	<script>
	/*
		var loc = document.getElementById("myLocation");
		var mloc = document.getElementById("moveLocation");

		function findLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showYourLocation);
			} else { 
				loc.innerHTML = "이 문장은 사용자의 웹 브라우저가 Geolocation API를 지원하지 않을 때 나타납니다!";
			}
		}

		function showYourLocation(position) {
			loc.innerHTML = "현재 사용자는 위도 " + position.coords.latitude + ", 경도 " + position.coords.longitude + "에 위치하고 있습니다.";	
		}
		
		
		
		*/
		
		 $(function() {        
		        // Geolocation API에 액세스할 수 있는지를 확인
		        if (navigator.geolocation) {
		            //위치 정보를 정기적으로 얻기
		            var id = navigator.geolocation.watchPosition(
		                    function(pos) {
		                    	console.log(pos.coords.latitude);
		                    	console.log(pos.coords.longitude);
		                        $('#latitude').html(pos.coords.latitude);     // 위도 
		                        $('#longitude').html(pos.coords.longitude); // 경도 
		                    });
		            
		            // 버튼 클릭으로 감시를 중지
		            $('#btnStop').click(function() {
		                navigator.geolocation.clearWatch(id);
		            });
		        } else {
		            alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.")
		        }
		        
		    });
		
	</script>
    <ul>
        <li>위도:<span id="latitude"></span></li>
        <li>경도:<span id="longitude"></span></li>
    </ul>
    <input id="btnStop" type="button" value="감시를 끝낸다" />

</body>
</html>