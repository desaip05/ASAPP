package com.parikshit.asapp.model;

public class ChatPreview {

	private int chatRoomId;
	private int userId;
	private String image;
	private String name;
	private String lastText;
	private long lastTextTime;
	
	public ChatPreview(){};
	
	public ChatPreview(int chatRoomId, int userId, String image, String name, String lastText, long lastTextTime) {
		super();
		this.chatRoomId = chatRoomId;
		this.userId = userId;
		this.image = image;
		this.name = name;
		this.lastText = lastText;
		this.lastTextTime = lastTextTime;
	}
	public int getChatRoomId() {
		return chatRoomId;
	}
	public void setChatRoomId(int chatRoomId) {
		this.chatRoomId = chatRoomId;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLastText() {
		return lastText;
	}
	public void setLastText(String lastText) {
		this.lastText = lastText;
	}
	public long getLastTextTime() {
		return lastTextTime;
	}
	public void setLastTextTime(long lastTextTime) {
		this.lastTextTime = lastTextTime;
	}
	
}
