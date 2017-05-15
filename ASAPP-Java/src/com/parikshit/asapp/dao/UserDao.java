package com.parikshit.asapp.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.parikshit.asapp.model.*;
import com.parikshit.asapp.util.DbUtil;

public class UserDao {
	private Connection connection;

	public UserDao() {
		connection = DbUtil.getConnection();
	}

	public boolean closeConnection() {
		if (connection != null) {
			try {
				connection.close();
				return true;
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		} else {
			return false;
		}

	}

	public User GetUserInfo(int id){
		
		User userData = null;
		try {			
			
			PreparedStatement preparedStatement;
			// Search By Date Query Statement

			// get all data
			preparedStatement = connection
					.prepareStatement("SELECT b.id, b.username, b.lastSeen FROM `User` b WHERE b.id = ?");
			preparedStatement.setInt(1, id);
			
			ResultSet res;
			res = preparedStatement.executeQuery();
			
			userData = new User();

			while (res.next()){
				userData.setId(res.getInt("id"));
				userData.setUsername(res.getString("username"));
				userData.setLastSeen(res.getLong("lastSeen"));	
			}
			System.out.println(userData.getId());
			return userData;		
		}

		catch (SQLException e) {
			System.out.println(e);
		}
	
		return userData;
	
	}	
	
	
	public int CheckIfUserExists(String username)
	{
		try {
			PreparedStatement preparedStatement;
			// Search By Date Query Statement

			// get all data,
			preparedStatement = connection
					.prepareStatement("SELECT U.id FROM User U "
							+ "WHERE U.username =? ");
			preparedStatement.setString(1, username);
			ResultSet res;
			res = preparedStatement.executeQuery();

			// retrieve results

			while (res.next()){
				
				return res.getInt("id");
			}
			
		} catch (SQLException e) {
			System.out.println(e);
			return 0;
		}
		return 0;
	}
	
	public int CreateUser(User userData)
	{	
		
		PreparedStatement preparedStatement;
		int key =0;

		try {
			String sql = "INSERT INTO `User` (`username`, `createdOn`, `lastModified`)"
					+ "VALUES (?,?,?)";
			preparedStatement = connection
					.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
			preparedStatement.setString(1,userData.getUsername());
			
			java.util.Date dt = new java.util.Date();
			java.text.SimpleDateFormat sdf = 
			     new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH-mm-ss.SSS");
			String currentTime = sdf.format(dt);
			preparedStatement.setString(2, currentTime);
			preparedStatement.setString(3, currentTime);
			
			preparedStatement.executeUpdate();			

			ResultSet res = preparedStatement.getGeneratedKeys(); 
						
			if ( res.next() ) {
			    // Retrieve the auto generated key(s).
			    key = res.getInt(1);
			}			

		} catch (SQLException e) {
			System.out.println(e);
		}
		
		return key;			
	}
	
	
	public boolean updateLastSeen(int userId){
		PreparedStatement preparedStatement;

		try {
			connection.setAutoCommit(false);
			preparedStatement = connection
					.prepareStatement("UPDATE `User` SET `lastSeen`=? WHERE `id`=?");
			
			java.util.Date dt = new java.util.Date();
			long currentTime = dt.getTime();
			preparedStatement.setLong(1, currentTime);
			preparedStatement.setInt(2, userId);
			
			preparedStatement.executeUpdate();
			
			 connection.commit();
			 connection.setAutoCommit(true);
				
			} catch (SQLException e) {
				e.printStackTrace();
				System.out.println("Failed!");
				try{
					 if(connection!=null){
						 connection.rollback();
						 connection.setAutoCommit(true);
					 }
			      }catch(SQLException se2){
			         e.printStackTrace();
			      }//end try
				return false;
			}
			System.out.println("Updated!");

			return true;

	}
}
