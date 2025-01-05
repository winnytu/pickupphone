import { useState } from 'react'
import KakaoChat from '../KakaoChat'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import './styles.scss'

const ChatEditor = ({ onGenerate }) => {
  const [chatData, setChatData] = useState({
    type: 'chat',
    metadata: {
      chat_type: 'personal',
      title: '',
      participants: [
        { id: 'user1', name: '', avatar: '', is_me: false },
        { id: 'me', name: '我', avatar: '', is_me: true }
      ]
    },
    content: [
      { id: 'msg1', sender_id: 'user1', text: '', timestamp: Date.now() }
    ]
  })
  const [showPreview, setShowPreview] = useState(false)

  const [newMember, setNewMember] = useState({ name: '', avatar: '' })

  const toggleChatType = () => {
    setChatData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        chat_type: prev.metadata.chat_type === 'personal' ? 'group' : 'personal'
      }
    }))
  }

  const addGroupMember = () => {
    if (!newMember.name) return
    
    setChatData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        participants: [
          ...prev.metadata.participants.filter(p => p.is_me),
          { 
            id: `user${prev.metadata.participants.length}`,
            name: newMember.name,
            avatar: newMember.avatar,
            is_me: false
          }
        ]
      }
    }))
    setNewMember({ name: '', avatar: '' })
  }

  const removeParticipant = (id) => {
    setChatData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        participants: prev.metadata.participants.filter(p => p.is_me || p.id !== id)
      },
      content: prev.content.filter(msg => msg.sender_id === 'me' || msg.sender_id !== id)
    }))
  }

  const addMessage = (sender_id) => {
    setChatData(prev => ({
      ...prev,
      content: [
        ...prev.content,
        {
          id: `msg${prev.content.length + 1}`,
          sender_id,
          text: '',
          timestamp: Date.now()
        }
      ]
    }))
  }

  const removeMessage = (index) => {
    setChatData(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }))
  }

  const updateMessage = (index, text) => {
    setChatData(prev => ({
      ...prev,
      content: prev.content.map((msg, i) => 
        i === index ? { ...msg, text } : msg
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowPreview(true)
    
    // 更新父組件的數據
    onGenerate({
      version: "1.0",
      metadata: {
        created_at: new Date().toISOString(),
        app_version: "1.0.0"
      },
      items: [chatData]
    })
  }

  const handleDownload = async () => {
    const element = document.querySelector('.preview-container')
    if (element) {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 3,
        logging: false,
        useCORS: true
      })
      
      canvas.toBlob((blob) => {
        saveAs(blob, `chat-${new Date().getTime()}.png`)
      }, 'image/png', 1.0)
    }
  }

  return (
    <div className="chat-editor-container">
      <form className="chat-editor" onSubmit={handleSubmit}>
        <div className="editor-section">
          <h3>基本設定</h3>
          <div className="chat-type-toggle">
            <button
              type="button"
              className={`toggle-button ${chatData.metadata.chat_type === 'personal' ? 'active' : ''}`}
              onClick={toggleChatType}
            >
              私人聊天
            </button>
            <button
              type="button"
              className={`toggle-button ${chatData.metadata.chat_type === 'group' ? 'active' : ''}`}
              onClick={toggleChatType}
            >
              群組聊天
            </button>
          </div>
          <div className="input-group">
            <label>聊天標題</label>
            <input
              type="text"
              value={chatData.metadata.title}
              onChange={(e) => setChatData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, title: e.target.value }
              }))}
              placeholder={chatData.metadata.chat_type === 'group' ? "例如：男團工作群" : "例如：李美麗"}
            />
          </div>
          {chatData.metadata.chat_type === 'group' ? (
            <div className="group-members">
              <h4>群組成員</h4>
              <div className="members-list">
                {chatData.metadata.participants
                  .filter(p => !p.is_me)
                  .map(member => (
                    <div key={member.id} className="member-item">
                      {member.avatar && (
                        <img src={member.avatar} alt={member.name} className="member-avatar" />
                      )}
                      <span className="member-name">{member.name}</span>
                      <button
                        type="button"
                        className="remove-member"
                        onClick={() => removeParticipant(member.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
              <div className="add-member">
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="成員名稱"
                />
                <input
                  type="text"
                  value={newMember.avatar}
                  onChange={(e) => setNewMember(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="頭像連結（選填）"
                />
                <button type="button" onClick={addGroupMember}>
                  新增成員
                </button>
              </div>
            </div>
          ) : (
            <div className="input-group">
              <label>對方名稱</label>
              <input
                type="text"
                value={chatData.metadata.participants[0].name}
                onChange={(e) => setChatData(prev => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    participants: [
                      { ...prev.metadata.participants[0], name: e.target.value },
                      prev.metadata.participants[1]
                    ]
                  }
                }))}
                placeholder="對方的名字"
              />
            </div>
          )}
          {!chatData.metadata.chat_type === 'group' && (
            <div className="input-group">
              <label>對方頭像</label>
              <input
                type="text"
                value={chatData.metadata.participants[0].avatar}
                onChange={(e) => setChatData(prev => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    participants: [
                      { ...prev.metadata.participants[0], avatar: e.target.value },
                      prev.metadata.participants[1]
                    ]
                  }
                }))}
                placeholder="頭像圖片連結（選填）"
              />
            </div>
          )}
        </div>

        <div className="editor-section">
          <div className="section-header">
            <h3>對話內容</h3>
            <div className="message-buttons">
              {chatData.metadata.chat_type === 'group' ? (
                chatData.metadata.participants.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={`add-message ${p.is_me ? 'me' : 'other'}`}
                    onClick={() => addMessage(p.id)}
                  >
                    ＋ {p.name}發言
                  </button>
                ))
              ) : (
                <>
                  <button 
                    type="button" 
                    className="add-message other"
                    onClick={() => addMessage('user1')}
                  >
                    ＋ 新增對方訊息
                  </button>
                  <button 
                    type="button" 
                    className="add-message me"
                    onClick={() => addMessage('me')}
                  >
                    ＋ 新增我的訊息
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="messages">
            {chatData.content.map((message, index) => (
              <div 
                key={index} 
                className={`message-editor ${message.sender_id === 'me' ? 'me' : 'other'}`}
              >
                <div className="message-header">
                  <span className="sender">
                    {message.sender_id === 'me' ? '我' : chatData.metadata.participants[0].name || '對方'}
                  </span>
                  <button
                    type="button"
                    className="remove-message"
                    onClick={() => removeMessage(index)}
                  >
                    ✕
                  </button>
                </div>
                <textarea
                  value={message.text}
                  onChange={(e) => updateMessage(index, e.target.value)}
                  placeholder={`輸入${message.sender_id === 'me' ? '我' : '對方'}的訊息...`}
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="generate-button">
          生成截圖
        </button>
      </form>

      {showPreview && (
        <div className="preview-section">
          <h3>預覽</h3>
          <div className="preview-container">
            <KakaoChat chatData={chatData} />
          </div>
          <div className="preview-actions">
            <button 
              type="button" 
              className="download-preview"
              onClick={handleDownload}
            >
              下載截圖
            </button>
            <button 
              type="button" 
              className="close-preview"
              onClick={() => setShowPreview(false)}
            >
              關閉預覽
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatEditor 