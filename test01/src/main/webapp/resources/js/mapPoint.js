	
	
	
	
	document.getElementById("btnStart").addEventListener("click", init);
	
	var watchID = null;
	var setNum = 0;
	var ele = document.getElementById("map");
	var customEvent = document.createEvent("mouseEvent");
	var customEvent2 = document.createEvent("mouseEvent");
	var customEvent3 = document.createEvent("mouseEvent");
	customEvent.initEvent('rightclick', true, true);
	customEvent2.initEvent('mousemove', true, true);
	customEvent3.initEvent('click', true, true);
	var latlng = null;
	var lat;
	var lit;
	var mapContainer = document.getElementById('map') // 지도를 표시할 div
	var mapOption = {
			 center:latlng,
		     level:3
		     }
	var map;
	
	function findLocation() {
		navigator.geolocation.getCurrentPosition(function(pos) {
			console.log("현위치");
			$('#latitude').html(pos.coords.latitude);     // 위도
            $('#longitude').html(pos.coords.longitude); // 경도
            lat = pos.coords.latitude;
            lit = pos.coords.longitude;
            latlng =  new kakao.maps.LatLng(lat,lit);
            mapOption = {
       			 center:latlng,
       		     level:3
       		     }
        	map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
            return map, lat, lit;
		})
	}
	
	findLocation();
	//var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
	
	function init()
		{
			console.log("====Start Click ======");
			var options = { enableHighAccuracy: true };
			
			watchID = navigator.geolocation.watchPosition(current_position, onError, options);
			// 시간마다 자동 맵 마킹 함수
		    // 3초 셋 setInterval End
			playMark = setInterval(function() {
		    	btnTest2(); // 마킹 함수 호출
		    	console.log("마킹. 60초지남//테스트6초"+latlng);	
		    	if(setNum == 1){
		    		clearInterval(playMark);
		    	}
		      }, 6000);
		} // init End
		 
	function current_position(position)
		{
			console.log("포지션====");
			lat = position.coords.latitude;
			lit = position.coords.longitude;
			return lat, lit;
			console.log("포"+lat);
			console.log("포"+lit);
			
		}    // current End
	
	console.log("밖----"+lat);
	console.log(lit);		   	   
		    
	var drawingFlag = false; // 선이 그려지고 있는 상태를 가지고 있을 변수입니다
	var moveLine; // 선이 그려지고 있을때 마우스 움직임에 따라 그려질 선 객체 입니다
	var clickLine // 마우스로 클릭한 좌표로 그려질 선 객체입니다
	var distanceOverlay; // 선의 거리정보를 표시할 커스텀오버레이 입니다
	var dots = {}; // 선이 그려지고 있을때 클릭할 때마다 클릭 지점과 거리를 표시하는 커스텀 오버레이 배열입니다.

	
	// 클릭으로 그려진 선을 지도에서 제거하는 함수입니다
	function deleteClickLine() {
	    if (clickLine) {
	        clickLine.setMap(null);    
	        clickLine = null;        
	    }
	}
	
	// 마우스 드래그로 그려지고 있는 선의 총거리 정보를 표시하거
	// 마우스 오른쪽 클릭으로 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 생성하고 지도에 표시하는 함수입니다
	function showDistance(content, position) {
	    
	    if (distanceOverlay) { // 커스텀오버레이가 생성된 상태이면
	        
	        // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
	        distanceOverlay.setPosition(position);
	        distanceOverlay.setContent(content);
	        
	    } else { // 커스텀 오버레이가 생성되지 않은 상태이면
	        
	        // 커스텀 오버레이를 생성하고 지도에 표시합니다
	        distanceOverlay = new kakao.maps.CustomOverlay({
	            map: map, // 커스텀오버레이를 표시할 지도입니다
	            content: content,  // 커스텀오버레이에 표시할 내용입니다
	            position: position, // 커스텀오버레이를 표시할 위치입니다.
	            xAnchor: 0,
	            yAnchor: 0,
	            zIndex: 3  
	        });      
	    }
	}
	
	// 그려지고 있는 선의 총거리 정보와
	// 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 삭제하는 함수입니다
	function deleteDistnce () {
	    if (distanceOverlay) {
	        distanceOverlay.setMap(null);
	        distanceOverlay = null;
	    }
	}
	
	// 선이 그려지고 있는 상태일 때 지도를 클릭하면 호출하여
	// 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 표출하는 함수입니다
	function displayCircleDot(position, distance) {

	    // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
	    var circleOverlay = new kakao.maps.CustomOverlay({
	        content: '<span class="dot"></span>',
	        position: position,
	        zIndex: 1
	    });

	    // 지도에 표시합니다
	    circleOverlay.setMap(map);

	    if (distance > 0) {
	        // 클릭한 지점까지의 그려진 선의 총 거리를 표시할 커스텀 오버레이를 생성합니다
	        var distanceOverlay = new kakao.maps.CustomOverlay({
	            content: '<div class="dotOverlay">거리 <span class="number">' + distance + '</span>m</div>',
	            position: position,
	            yAnchor: 1,
	            zIndex: 2
	        });

	        // 지도에 표시합니다
	        distanceOverlay.setMap(map);
	    }

	    // 배열에 추가합니다
	    dots.push({circle:circleOverlay, distance: distanceOverlay});
	}
	
	// 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 지도에서 모두 제거하는 함수입니다
	function deleteCircleDot() {
	    var i;
	
	    for ( i = 0; i < dots.length; i++ ){
	        if (dots[i].circle) { 
	            dots[i].circle.setMap(null);
	        }
	
	        if (dots[i].distance) {
	            dots[i].distance.setMap(null);
	        }
	    }
	
	    dots = [];
	}
	
	// 마우스 우클릭 하여 선 그리기가 종료됐을 때 호출하여
	// 그려진 선의 총거리 정보와 거리에 대한 도보, 자전거 시간을 계산하여
	// HTML Content를 만들어 리턴하는 함수입니다
	function getTimeHTML(distance) {
	
	    // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
	    var walkkTime = distance / 67 | 0;
	    var walkHour = '', walkMin = '';
	
	    // 계산한 도보 시간이 60분 보다 크면 시간으로 표시합니다
	    if (walkkTime > 60) {
	        walkHour = '<span class="number">' + Math.floor(walkkTime / 60) + '</span>시간 '
	    }
	    walkMin = '<span class="number">' + walkkTime % 60 + '</span>분'
	
	    // 자전거의 평균 시속은 16km/h 이고 이것을 기준으로 자전거의 분속은 267m/min입니다
	    var bycicleTime = distance / 227 | 0;
	    var bycicleHour = '', bycicleMin = '';
	
	    // 계산한 자전거 시간이 60분 보다 크면 시간으로 표출합니다
	    if (bycicleTime > 60) {
	        bycicleHour = '<span class="number">' + Math.floor(bycicleTime / 60) + '</span>시간 '
	    }
	    bycicleMin = '<span class="number">' + bycicleTime % 60 + '</span>분'
	
	    // 거리와 도보 시간, 자전거 시간을 가지고 HTML Content를 만들어 리턴합니다
	    var content = '<ul class="dotOverlay distanceInfo">';
	    content += '    <li>';
	    content += '        <span class="label">총거리</span><span class="number">' + distance + '</span>m';
	    content += '    </li>';
	    content += '    <li>';
	    content += '        <span class="label">도보</span>' + walkHour + walkMin;
	    content += '    </li>';
	    content += '    <li>';
	    content += '        <span class="label">자전거</span>' + bycicleHour + bycicleMin;
	    content += '    </li>';
	    content += '</ul>'
	
	    return content;
	}
	
	function btnTest() {
			latlng = new kakao.maps.LatLng(37.564019, 126.98633);
			var clickPosition = latlng;
			
		    // 지도 클릭이벤트가 발생했는데 선을 그리고있는 상태가 아니면
		    if (!drawingFlag) {
		    	
		        // 상태를 true로, 선이 그리고있는 상태로 변경합니다
		        drawingFlag = true;
		        
		        // 지도 위에 선이 표시되고 있다면 지도에서 제거합니다
		        deleteClickLine();
		        
		        // 지도 위에 커스텀오버레이가 표시되고 있다면 지도에서 제거합니다
		        deleteDistnce();
		
		        // 지도 위에 선을 그리기 위해 클릭한 지점과 해당 지점의 거리정보가 표시되고 있다면 지도에서 제거합니다
		        deleteCircleDot();
		    
		        // 클릭한 위치를 기준으로 선을 생성하고 지도위에 표시합니다
		        clickLine = new kakao.maps.Polyline({
		            map: map, // 선을 표시할 지도입니다
		            path: [clickPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
		            strokeWeight: 3, // 선의 두께입니다
		            strokeColor: '#db4040', // 선의 색깔입니다
		            strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
		            strokeStyle: 'solid' // 선의 스타일입니다
		        });
		        
		        // 선이 그려지고 있을 때 마우스 움직임에 따라 선이 그려질 위치를 표시할 선을 생성합니다
		        moveLine = new kakao.maps.Polyline({
		            strokeWeight: 3, // 선의 두께입니다
		            strokeColor: '#db4040', // 선의 색깔입니다
		            strokeOpacity: 0.5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
		            strokeStyle: 'solid' // 선의 스타일입니다
		        });
		    
		        // 클릭한 지점에 대한 정보를 지도에 표시합니다
		        displayCircleDot(clickPosition, 0);
		
		            
		    } else { // 선이 그려지고 있는 상태이면
		    	
		        // 그려지고 있는 선의 좌표 배열을 얻어옵니다
		        var path = clickLine.getPath();
		
		        // 좌표 배열에 클릭한 위치를 추가합니다
		        path.push(clickPosition);
		        
		        // 다시 선에 좌표 배열을 설정하여 클릭 위치까지 선을 그리도록 설정합니다
		        clickLine.setPath(path);
		
		        var distance = Math.round(clickLine.getLength());
		        displayCircleDot(clickPosition, distance);
		    }			
		}
	
	function btnTest2() {
		    latlng = new kakao.maps.LatLng(lat, lit);
		    console.log("실시간찍힘");
			console.log(latlng);
			var clickPosition = latlng;
			
		    // 지도 클릭이벤트가 발생했는데 선을 그리고있는 상태가 아니면
		    if (!drawingFlag) {
		
		        // 상태를 true로, 선이 그리고있는 상태로 변경합니다
		        drawingFlag = true;
		        
		        // 지도 위에 선이 표시되고 있다면 지도에서 제거합니다
		        deleteClickLine();
		        
		        // 지도 위에 커스텀오버레이가 표시되고 있다면 지도에서 제거합니다
		        deleteDistnce();
		
		        // 지도 위에 선을 그리기 위해 클릭한 지점과 해당 지점의 거리정보가 표시되고 있다면 지도에서 제거합니다
		        deleteCircleDot();
		    
		        // 클릭한 위치를 기준으로 선을 생성하고 지도위에 표시합니다
		        clickLine = new kakao.maps.Polyline({
		            map: map, // 선을 표시할 지도입니다
		            path: [clickPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
		            strokeWeight: 3, // 선의 두께입니다
		            strokeColor: '#db4040', // 선의 색깔입니다
		            strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
		            strokeStyle: 'solid' // 선의 스타일입니다
		        });
		        
		        // 선이 그려지고 있을 때 마우스 움직임에 따라 선이 그려질 위치를 표시할 선을 생성합니다
		        moveLine = new kakao.maps.Polyline({
		            strokeWeight: 3, // 선의 두께입니다
		            strokeColor: '#db4040', // 선의 색깔입니다
		            strokeOpacity: 0.5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
		            strokeStyle: 'solid' // 선의 스타일입니다
		        });
		    
		        // 클릭한 지점에 대한 정보를 지도에 표시합니다
		        displayCircleDot(clickPosition, 0);
		
		            
		    } else { // 선이 그려지고 있는 상태이면
		
		        // 그려지고 있는 선의 좌표 배열을 얻어옵니다
		        var path = clickLine.getPath();
		
		        // 좌표 배열에 클릭한 위치를 추가합니다
		        path.push(clickPosition);
		        
		        // 다시 선에 좌표 배열을 설정하여 클릭 위치까지 선을 그리도록 설정합니다
		        clickLine.setPath(path);
		
		        var distance = Math.round(clickLine.getLength());
		        displayCircleDot(clickPosition, distance);
		    }
			
		}
	
	function btnTest3() {
			latlng = new kakao.maps.LatLng(37.6045457, 127.074291);
			var clickPosition = latlng;
			
		    // 지도 클릭이벤트가 발생했는데 선을 그리고있는 상태가 아니면
		    if (!drawingFlag) {
		
		        // 상태를 true로, 선이 그리고있는 상태로 변경합니다
		        drawingFlag = true;
		        
		        // 지도 위에 선이 표시되고 있다면 지도에서 제거합니다
		        deleteClickLine();
		        
		        // 지도 위에 커스텀오버레이가 표시되고 있다면 지도에서 제거합니다
		        deleteDistnce();
		
		        // 지도 위에 선을 그리기 위해 클릭한 지점과 해당 지점의 거리정보가 표시되고 있다면 지도에서 제거합니다
		        deleteCircleDot();
		    
		        // 클릭한 위치를 기준으로 선을 생성하고 지도위에 표시합니다
		        clickLine = new kakao.maps.Polyline({
		            map: map, // 선을 표시할 지도입니다
		            path: [clickPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
		            strokeWeight: 3, // 선의 두께입니다
		            strokeColor: '#db4040', // 선의 색깔입니다
		            strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
		            strokeStyle: 'solid' // 선의 스타일입니다
		        });
		        
		        // 선이 그려지고 있을 때 마우스 움직임에 따라 선이 그려질 위치를 표시할 선을 생성합니다
		        moveLine = new kakao.maps.Polyline({
		            strokeWeight: 3, // 선의 두께입니다
		            strokeColor: '#db4040', // 선의 색깔입니다
		            strokeOpacity: 0.5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
		            strokeStyle: 'solid' // 선의 스타일입니다
		        });
		    
		        // 클릭한 지점에 대한 정보를 지도에 표시합니다
		        displayCircleDot(clickPosition, 0);
		
		            
		    } else { // 선이 그려지고 있는 상태이면
		
		        // 그려지고 있는 선의 좌표 배열을 얻어옵니다
		        var path = clickLine.getPath();
		
		        // 좌표 배열에 클릭한 위치를 추가합니다
		        path.push(clickPosition);
		        
		        // 다시 선에 좌표 배열을 설정하여 클릭 위치까지 선을 그리도록 설정합니다
		        clickLine.setPath(path);
		
		        var distance = Math.round(clickLine.getLength());
		        displayCircleDot(clickPosition, distance);
		    }
			console.log(customEvent3);
			console.log(latlng);
		}
	
	function btnTest4() {
			latlng = new kakao.maps.LatLng(37.6045367, 127.074212);
			var clickPosition = latlng;
			
		    // 지도 클릭이벤트가 발생했는데 선을 그리고있는 상태가 아니면
		    if (!drawingFlag) {
		
		        // 상태를 true로, 선이 그리고있는 상태로 변경합니다
		        drawingFlag = true;
		        
		        // 지도 위에 선이 표시되고 있다면 지도에서 제거합니다
		        deleteClickLine();
		        
		        // 지도 위에 커스텀오버레이가 표시되고 있다면 지도에서 제거합니다
		        deleteDistnce();
		
		        // 지도 위에 선을 그리기 위해 클릭한 지점과 해당 지점의 거리정보가 표시되고 있다면 지도에서 제거합니다
		        deleteCircleDot();
		    
		        // 클릭한 위치를 기준으로 선을 생성하고 지도위에 표시합니다
		        clickLine = new kakao.maps.Polyline({
		            map: map, // 선을 표시할 지도입니다
		            path: [clickPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
		            strokeWeight: 3, // 선의 두께입니다
		            strokeColor: '#db4040', // 선의 색깔입니다
		            strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
		            strokeStyle: 'solid' // 선의 스타일입니다
		        });
		        
		        // 선이 그려지고 있을 때 마우스 움직임에 따라 선이 그려질 위치를 표시할 선을 생성합니다
		        moveLine = new kakao.maps.Polyline({
		            strokeWeight: 3, // 선의 두께입니다
		            strokeColor: '#db4040', // 선의 색깔입니다
		            strokeOpacity: 0.5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
		            strokeStyle: 'solid' // 선의 스타일입니다
		        });
		    
		        // 클릭한 지점에 대한 정보를 지도에 표시합니다
		        displayCircleDot(clickPosition, 0);
		
		            
		    } else { // 선이 그려지고 있는 상태이면
		
		        // 그려지고 있는 선의 좌표 배열을 얻어옵니다
		        var path = clickLine.getPath();
		
		        // 좌표 배열에 클릭한 위치를 추가합니다
		        path.push(clickPosition);
		        
		        // 다시 선에 좌표 배열을 설정하여 클릭 위치까지 선을 그리도록 설정합니다
		        clickLine.setPath(path);
		
		        var distance = Math.round(clickLine.getLength());
		        displayCircleDot(clickPosition, distance);
		    }
		}
	
	function btnTest5() {
			latlng = new kakao.maps.LatLng(37.570883, 126.985212);
			var clickPosition = latlng;
			
		    // 지도 클릭이벤트가 발생했는데 선을 그리고있는 상태가 아니면
		    if (!drawingFlag) {
		
		        // 상태를 true로, 선이 그리고있는 상태로 변경합니다
		        drawingFlag = true;
		        
		        // 지도 위에 선이 표시되고 있다면 지도에서 제거합니다
		        deleteClickLine();
		        
		        // 지도 위에 커스텀오버레이가 표시되고 있다면 지도에서 제거합니다
		        deleteDistnce();
		
		        // 지도 위에 선을 그리기 위해 클릭한 지점과 해당 지점의 거리정보가 표시되고 있다면 지도에서 제거합니다
		        deleteCircleDot();
		    
		        // 클릭한 위치를 기준으로 선을 생성하고 지도위에 표시합니다
		        clickLine = new kakao.maps.Polyline({
		            map: map, // 선을 표시할 지도입니다
		            path: [clickPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
		            strokeWeight: 3, // 선의 두께입니다
		            strokeColor: '#db4040', // 선의 색깔입니다
		            strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
		            strokeStyle: 'solid' // 선의 스타일입니다
		        });
		        
		        // 선이 그려지고 있을 때 마우스 움직임에 따라 선이 그려질 위치를 표시할 선을 생성합니다
		        moveLine = new kakao.maps.Polyline({
		            strokeWeight: 3, // 선의 두께입니다
		            strokeColor: '#db4040', // 선의 색깔입니다
		            strokeOpacity: 0.5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
		            strokeStyle: 'solid' // 선의 스타일입니다
		        });
		    
		        // 클릭한 지점에 대한 정보를 지도에 표시합니다
		        displayCircleDot(clickPosition, 0);
		
		            
		    } else { // 선이 그려지고 있는 상태이면
		
		        // 그려지고 있는 선의 좌표 배열을 얻어옵니다
		        var path = clickLine.getPath();
		
		        // 좌표 배열에 클릭한 위치를 추가합니다
		        path.push(clickPosition);
		        
		        // 다시 선에 좌표 배열을 설정하여 클릭 위치까지 선을 그리도록 설정합니다
		        clickLine.setPath(path);
		
		        var distance = Math.round(clickLine.getLength());
		        displayCircleDot(clickPosition, distance);
		    }
			console.log(customEvent3);
			console.log(latlng);
		}
	
	function clearWatch() {
			clearInterval(playMark); // 타이머 함수 종료
			setNum = 1;
			console.log("====stop stop====");
			
		    // 지도 오른쪽 클릭 이벤트가 발생했는데 선을 그리고있는 상태이면
		    if (drawingFlag) {
		    	 
		        // 마우스무브로 그려진 선은 지도에서 제거합니다
		        moveLine.setMap(null);
		        moveLine = null;  
		        
		        // 마우스 클릭으로 그린 선의 좌표 배열을 얻어옵니다
		        var path = clickLine.getPath();
		    
		        // 선을 구성하는 좌표의 개수가 2개 이상이면
		        if (path.length > 1) {
		
		            // 마지막 클릭 지점에 대한 거리 정보 커스텀 오버레이를 지웁니다
		            if (dots[dots.length-1].distance) {
		                dots[dots.length-1].distance.setMap(null);
		                dots[dots.length-1].distance = null;    
		            }
		
		            var distance = Math.round(clickLine.getLength()), // 선의 총
																		// 거리를
																		// 계산합니다
		                content = getTimeHTML(distance); // 커스텀오버레이에 추가될
															// 내용입니다
		                
		            // 그려진 선의 거리정보를 지도에 표시합니다
		            showDistance(content, path[path.length-1]);  
		             
		        } else {
		
		            // 선을 구성하는 좌표의 개수가 1개 이하이면
		            // 지도에 표시되고 있는 선과 정보들을 지도에서 제거합니다.
		            deleteClickLine();
		            deleteCircleDot(); 
		            deleteDistnce();
		
		        }
		        
		        // 상태를 false로, 그리지 않고 있는 상태로 변경합니다
		        drawingFlag = false;          
		    }  
			navigator.geolocation.clearWatch(watchID);
		    watchID = null;
		} // clearWatch End
		
		
	// onError Callback receives a PositionError object    
	function onError(error) {
		 alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.")
	     console.log('code: '    + error.code    + '\n' +
	            'message: ' + error.message + '\n');
	   } // onErr End

		
	    