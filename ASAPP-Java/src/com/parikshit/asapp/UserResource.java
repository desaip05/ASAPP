package com.parikshit.asapp;

import java.io.IOException;
import java.util.ArrayList;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
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

import org.glassfish.jersey.server.ContainerRequest;
import org.glassfish.jersey.server.ContainerResponse;

import com.parikshit.asapp.dao.UserDao;
import com.parikshit.asapp.model.User;


/**
 * Root resource (exposed at "user" path)
 */
@Path("user")

public class UserResource implements ContainerResponseFilter{
//public class UserResource{

	@Context
	UriInfo uriInfo;
	
	@Context
	Request request;
	String id;
	
	UserDao userDao = new UserDao();  
	
	// This method is called if HTML is request
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getUser(
    		@QueryParam("userId") int userId
    		) {
    	System.out.println("Getting user info for userId: " + userId );
    	User user = userDao.GetUserInfo(userId);
    	
      return user.toString();
    }
    
	// This method is called if HTML is request
    @GET
    @Path("check")
    @Produces(MediaType.TEXT_PLAIN)
    public int checkIfUserExists(
    		@QueryParam("username") String username
    		) {
    	System.out.println("Getting user info for userId: " + username );
    	int userExists = userDao.CheckIfUserExists(username);
    	
      return userExists;
    }
    
    
	@POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response postUser(User user) throws Exception{
		String output = "";
		int statusCode = 201;
        int userId = userDao.CheckIfUserExists(user.getUsername());
        if(userId!=0){
        	statusCode = 409;
        	User userInfo = userDao.GetUserInfo(userId);
        	output = userInfo.toString();
        	System.out.println("Result = "+ output);
        }else{
        	userId = userDao.CreateUser(user);
            if(userId!=0){
            	User userInfo = userDao.GetUserInfo(userId);
            	output = userInfo.toString();
            }else{
            	statusCode = 500;
            	output = "User cannot be created";
            }      
        	System.out.println("Result = "+ output + "-" + userId);
        }     
        return Response.status(statusCode).entity(output).build();
    }    
	
	@PUT
	@Path("logout")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response logoutUser(User user) throws Exception{
		System.out.println("Logging out user");
		String output = "";
		int statusCode = 200;
		
		int userId = user.getId();
        if(userId!=0){
        	boolean updated = userDao.updateLastSeen(userId);
        	if(updated){
        		output = "Success";
        	}
        	else{
            	statusCode = 500;
            	output = "Cannot update lastSeen for user: " + userId ;
            }  
        }    
    	System.out.println("Result = "+ output + "-" + userId);
  
        return Response.status(statusCode).entity(output).build();
    }    
	
	 @Override
	 public void filter(ContainerRequestContext creq, ContainerResponseContext
	 cresp) throws IOException {
	
	 cresp.getHeaders().putSingle("Access-Control-Allow-Origin", "*");
	 cresp.getHeaders().putSingle("Access-Control-Allow-Credentials", "true");
	 cresp.getHeaders().putSingle("Access-Control-Allow-Methods", 
			 "GET, POST, DELETE, PUT, OPTIONS, HEAD");
	 cresp.getHeaders().putSingle("Access-Control-Allow-Headers",
	 "Content-Type, Accept, X-Requested-With");
	
	 }

}
