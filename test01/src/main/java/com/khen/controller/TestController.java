package com.khen.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@RequestMapping("/test/*")
public class TestController {
	
	@Autowired
	@RequestMapping("/FacilityMap")
	public void MapPoint() {
		System.out.println("ddddd");
		
	}
}
