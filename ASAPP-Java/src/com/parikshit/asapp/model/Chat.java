package com.parikshit.asapp.model;

import java.io.IOException;
import java.io.Serializable;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

@XmlRootElement(name = "chat")

public class Chat implements Serializable {

	private static final long serialVersionUID = 1L;
	private int chatId;
	private String message;
	private int chatRoomId;
	private int fromUser;
	private String fromUsername;
	private long messageTime;

	public Chat() {
	}

	public Chat(int id, String message, int chatRoomId, int fromUser) {
		// this.chatId = id;
		this.message = message;
		this.chatRoomId = chatRoomId;
		this.fromUser = fromUser;
	}

	public int getChatId() {
		return chatId;
	}

	@XmlElement
	public void setChatId(int chatId) {
		this.chatId = chatId;
	}

	public String getMessage() {
		return message;
	}

	@XmlElement
	public void setMessage(String message) {
		this.message = message;
	}

	public int getChatRoomId() {
		return chatRoomId;
	}

	@XmlElement
	public void setChatRoomId(int chatRoomId) {
		this.chatRoomId = chatRoomId;
	}

	public int getFromUser() {
		return fromUser;
	}

	@XmlElement
	public void setFromUser(int fromUser) {
		this.fromUser = fromUser;
	}

	public long getMessageTime() {
		return messageTime;
	}

	@XmlElement
	public void setMessageTime(long timestamp) {
		this.messageTime = timestamp;
	}

	public String getFromUsername() {
		return fromUsername;
	}

	@XmlElement
	public void setFromUsername(String fromUsername) {
		this.fromUsername = fromUsername;
	}

	
	@Override
	public String toString() {
		ObjectMapper mapper = new ObjectMapper();
		try {
			String jsonInString = mapper.writeValueAsString(this);
			return jsonInString;
		} catch (JsonGenerationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "";
	}

}
