package com.parikshit.asapp;

import java.io.IOException;
import java.util.ArrayList;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import com.parikshit.asapp.dao.ChatDao;
import com.parikshit.asapp.dao.UserDao;
import com.parikshit.asapp.model.Chat;
import com.parikshit.asapp.model.ChatPreview;
import com.parikshit.asapp.model.User;

/**
 * Root resource (exposed at "chat" path)
 */
@Path("chat")

public class ChatResource implements ContainerResponseFilter {


	@Context
	UriInfo uriInfo;

	@Context
	Request request;
	String id;

	ChatDao chatDao = new ChatDao();
	UserDao userDao = new UserDao();
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Chat> getChatHistory(@QueryParam("chatRoomId") int chatRoomId, @QueryParam("userId") int userId) {

		User user = userDao.GetUserInfo(userId);
		
		ArrayList<Chat> chatHistory = (ArrayList<Chat>) chatDao.getChatHistory(chatRoomId, user.getLastSeen());

		return chatHistory;
	}

	@POST
	@Consumes({ MediaType.APPLICATION_JSON })
	public Response postChat(Chat chat) throws Exception {
		String output = "";
		int statusCode = 201;
		System.out.println("Incoming data = " + chat);
		int entryRow = chatDao.saveChat(chat);		
		
		if (entryRow != 0) {
			statusCode = 200;
			output = "success";
			System.out.println("Result = " + output);
		} else {
			statusCode = 500;
			output = "Chat cannot be saved";
			System.out.println("Result = " + output);
		}

		return Response.status(statusCode).entity(output).build();
	}

	 @Override
	 public void filter(ContainerRequestContext creq, ContainerResponseContext
	 cresp) throws IOException {
	
	 cresp.getHeaders().putSingle("Access-Control-Allow-Origin", "*");
	 cresp.getHeaders().putSingle("Access-Control-Allow-Credentials", "true");
	 cresp.getHeaders().putSingle("Access-Control-Allow-Methods", 
			 "GET, POST,DELETE, PUT, OPTIONS, HEAD");
	 cresp.getHeaders().putSingle("Access-Control-Allow-Headers",
	 "Content-Type, Accept, X-Requested-With");
	
	 }
	
}
