<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>

<style>

.Calendar {

	width: 300px;

}

.CalendarDayDiv--td { 

	padding: 0px;

}

.CalendarDayDiv--btn{
	border: 0px;
	width: 100%;
	background-color: transparent !important;
	color: #87CEEB;
	font-weight: bold;

}

.CalendarDayDiv--btndisabled{
	border: 0px;
	width: 100%;
	background-color: transparent !important;
	color: gray;

}



.DayOfTheWeek_li{
	display: inline-block;
	padding: 5px;
}

.DayOfTheWeek_ui{

	width: 300px;
	padding: 0px;
	margin: 0px;
}

</style>

<script src="http://code.jquery.com/jquery-latest.min.js"></script>

<script>
	
	var calendar = {
			
		year : new Date().getFullYear(),
		month : (new Date().getMonth())+1,
		
		calendarYearMonth : function(event){
				
			if(event == null){
			
				$(".CalendarMonth").val(this.month);
				$(".CalendarYear").val(this.year);
				
				document.getElementsByClassName("CalendarMonth_small")[0].innerHTML = this.year + '년 ' + this.month +'월' ;

			}else if(event == 'next'){
				
				event = null;
				this.month = $(".CalendarMonth").val();
				this.year = $(".CalendarYear").val();
				
				if(this.month == 12){
					this.month = 0;
					this.year *= 1;
					this.year += 1; 
				}
				
				this.month *= 1;
				this.month += 1;
				$(".CalendarMonth").val(this.month);
				$(".CalendarYear").val(this.year);
				
				document.getElementsByClassName("CalendarMonth_small")[0].innerHTML = this.year + '년 ' + this.month +'월' ;
				this.calendarDay();
				
			}else if(event == 'before'){
					
					event = null
					this.month = $(".CalendarMonth").val();
					this.year = $(".CalendarYear").val();
					
					if(this.month == 1){
						this.month = 13;
						this.year -= 1; 
					}
					
				
					if(this.month == (new Date().getMonth())+1 && this.year == new Date().getFullYear()){
						
						this.month = (new Date().getMonth())+1;
						
					}else{
						
						this.month -= 1;
						
					}
					
					$(".CalendarMonth").val(this.month);
					$(".CalendarYear").val(this.year);
					
					console.log(month);
					console.log(calendarDay());
					
					document.getElementsByClassName("CalendarMonth_small")[0].innerHTML = this.year + '년 ' + this.month +'월' ;
					this.calendarDay();
			}
		},
			
		calendarDay : function(){
			
			var str = '';
			var yestermonth = this.month-1;
			var date = new Date(this.year, this.month, 0).getDate();
			var yestermonthDay = new Date(this.year, yestermonth, 0).getDay();
			var firstWeekDate = 0;
			var disabled = '';
			var classbtn = '';
			
			str += "<table>"
			
			if(this.month == (new Date().getMonth())+1 && this.year == new Date().getFullYear()){
				disabled = 'disabled';
				classbtn = 'CalendarDayDiv--btndisabled';
			}else{
				classbtn = 'CalendarDayDiv--btn';
			}
			
			if((6-yestermonthDay) != 0){
				str += "<tr>";
				
				for(var i=0; i<=yestermonthDay; i++){
					str += "<td></td>";
				}
				
				for(var i=0; i< 6-yestermonthDay; i++){
					
					if((i+1) > new Date().getDate()){
						disabled = '';
						classbtn = 'CalendarDayDiv--btn'
					}
					
					str += "<td align='center' class='CalendarDayDiv--td'><button class='"+classbtn+"' "+disabled+">"+(i+1)+"</button></td>";
					
					firstWeekDate++;
				}
				
				str += "</tr><tr>";
			}
			
			for(var i=firstWeekDate; i<date; i++){
				
				if((i-firstWeekDate)%7 == 0 && i > 6){
					str += "<tr>"
				}
				
				if((i+1) > new Date().getDate()){
					disabled = '';
					classbtn = 'CalendarDayDiv--btn'
				}
				
				str += "<td align='center' class='CalendarDayDiv--td'><button class='"+classbtn+"' "+disabled+">"+(i+1)+"</button></td>";
				
				if((i-firstWeekDate)%7 == 6 && i > 6){
					str += "</tr>";
				}
			}
			
			document.getElementsByClassName("CalendarDayDiv")[0].innerHTML = str;
			
		}
		
	}
</script>


</head>
<body>
	
	<div class='Calendar'>
		<!-- <        > -->
		<div align='center' class="CalendarMonth">
			<button onclick="calendar.calendarYearMonth('before')"> < </button>
			<small class='CalendarMonth_small'></small>
			<hidden class='CalendarMonth'></hidden>
			<hidden class='CalendarYear'></hidden>
			<button onclick="calendar.calendarYearMonth('next')"> > </button>
		</div>
		
		<!-- <     2020-03     > -->
		<script>calendar.calendarYearMonth()</script>
		
		<div align='center' class="DayOfTheWeek">
			<ul class="DayOfTheWeek_ui">
				<li class="DayOfTheWeek_li"><small>일</small></li>
				<li class="DayOfTheWeek_li"><small>월</small></li>
				<li class="DayOfTheWeek_li"><small>화</small></li>
				<li class="DayOfTheWeek_li"><small>수</small></li>
				<li class="DayOfTheWeek_li"><small>목</small></li>
				<li class="DayOfTheWeek_li"><small>금</small></li>
				<li class="DayOfTheWeek_li"><small>토</small></li>
			</ul>
		</div>
		
		<div align='center' class='CalendarDayDiv'>
			<script>calendar.calendarDay()</script>
		</div>
	</div>
</body>
</html>