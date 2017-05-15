package com.parikshit.asapp.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.TimeZone;

import com.parikshit.asapp.model.Chat;
import com.parikshit.asapp.model.ChatPreview;
import com.parikshit.asapp.model.User;
import com.parikshit.asapp.util.DbUtil;

public class ChatDao {

	private Connection connection;

	public ChatDao() {
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

	public int saveChat(Chat chat){
		int chatId = 0;

		PreparedStatement preparedStatement;

		try {
			String sql = "INSERT INTO `ChatLog` (`chatRoomId`, `fromUser`, `message`, `messageTime`)" + "VALUES (?,?,?,?)";
			preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
			preparedStatement.setInt(1, chat.getChatRoomId());
			preparedStatement.setInt(2, chat.getFromUser());
			preparedStatement.setString(3, chat.getMessage());
			
			java.util.Date dt = new java.util.Date();
			long currentTime = dt.getTime();
			preparedStatement.setLong(4, currentTime);
			preparedStatement.executeUpdate();

			ResultSet res = preparedStatement.getGeneratedKeys();

			if (res.next()) {
				// Retrieve the auto generated key(s).
				chatId = res.getInt(1);
				return chatId;
			}

		} catch (SQLException e) {
			System.out.println(e);
			return chatId;
		}

		return chatId;
	}
	
	public List<Chat> getChatHistory(int chatRoomId, long lastSeen){
		List<Chat> chatHistory = new ArrayList<Chat>();
		Chat chat = null;
		PreparedStatement preparedStatement;
		System.out.println("Getting messages after: " + lastSeen);
		try {
			String sql = "SELECT `chatId`, `chatRoomId`, `fromUser`, `message`, `messageTime` from `ChatLog` WHERE `chatRoomId` = ? and `messageTime` > ?";
			preparedStatement = connection.prepareStatement(sql);
			preparedStatement.setInt(1, chatRoomId);
			preparedStatement.setLong(2, lastSeen);
			ResultSet res;
			res = preparedStatement.executeQuery();

			while (res.next()){				
				chat = new Chat();

				chat.setChatId(res.getInt("chatId"));
				chat.setChatRoomId(res.getInt("chatRoomId"));
				chat.setFromUser(res.getInt("fromUser"));
				chat.setMessage(res.getString("message"));
				chat.setMessageTime(res.getLong("messageTime"));
		
				chatHistory.add(chat);
			}
			
			for(Chat chatObj: chatHistory){
				preparedStatement = connection
						.prepareStatement("SELECT `username` FROM `User` WHERE `id` = ?");
				preparedStatement.setInt(1, chatObj.getFromUser());
				res = preparedStatement.executeQuery();
				while (res.next()){	
					chatObj.setFromUsername(res.getString("username"));
				}
			}

		} catch (SQLException e) {
			System.out.println(e);
		}

		return chatHistory;
	}

}
