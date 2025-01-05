import { useState } from 'react'
import './styles.scss'

const DOCUMENTATION = `### **撿手機文學創作簡易說明文件（含角色頭像功能）**

---

## **核心概念**
撿手機文學是一種以手機內容（如聊天記錄、備忘錄）展現故事的文學形式，讀者直接從碎片化的內容中拼湊故事背景、發展及結局。**結構靈活**，內容可根據劇情需求自由穿插。

---

## **讀者需提供資訊**
...
`  // 這裡放入完整的說明文件內容

const CharacterForm = ({ onGenerate }) => {
  const [showDocs, setShowDocs] = useState(false)
  const [settings, setSettings] = useState({
    mainCharacter: {
      name: '李楷燦',
      role: '男團成員',
      personality: '活潑調皮'
    },
    secondCharacter: {
      name: '朴志晟',
      role: '男團忙內',
      personality: '內向但細膩'
    },
    supportingCharacters: [
      {
        name: '主舞A',
        role: '男團主舞',
        personality: '開朗活潑'
      },
      {
        name: '忙內B',
        role: '男團成員',
        personality: '溫和友善'
      }
    ],
    relationship: '團員兼曖昧對象',
    theme: '甜寵',
    development: '關係升溫',
    background: '娛樂圈',
    style: '幽默且甜蜜',
    length: '中篇',
    ending: '開放式'
  })

  const generateTemplate = (settings) => {
    const template = `撿手機文學創作資訊模板

角色設定：
主角姓名為 ${settings.mainCharacter.name}，身份為 ${settings.mainCharacter.role}，性格 ${settings.mainCharacter.personality}。
次要角色為 ${settings.secondCharacter.name}，身份為 ${settings.secondCharacter.role}，性格 ${settings.secondCharacter.personality}。
兩人關係為 ${settings.relationship}。上傳角色頭像圖片用於增強代入感（可選）。

情感基調：
主題為 ${settings.theme}，角色關係發展方向為 ${settings.development}，希望展現日常的幽默互動與漸進的情感暗湧。

主要情節：
背景設定為 ${settings.background}，核心事件為 某日，粉絲撿到${settings.mainCharacter.name}的手機，發現與${settings.secondCharacter.name}的私密對話與備忘錄，通過內容揭示${settings.mainCharacter.name}對${settings.secondCharacter.name}的特別關注。發展方向為 ${settings.development}。

特殊需求：
希望對話風格 ${settings.style}，整篇為 ${settings.length}，包含 群組對話、私聊與備忘錄穿插，結局偏好為 ${settings.ending}。`

    return template
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const template = generateTemplate(settings)
    
    // 創建一個臨時的 textarea 來複製文字
    const textarea = document.createElement('textarea')
    textarea.value = template
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    
    // 顯示提示
    alert('已複製模板到剪貼簿！')
    
    // 同時觸發父組件的回調
    onGenerate(settings)
  }

  const handleChange = (section, field, value, index) => {
    if (section === 'supportingCharacters') {
      setSettings(prev => ({
        ...prev,
        supportingCharacters: prev.supportingCharacters.map((char, i) => 
          i === index ? { ...char, [field]: value } : char
        )
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        [section]: section === 'mainCharacter' || section === 'secondCharacter'
          ? { ...prev[section], [field]: value }
          : value
      }))
    }
  }

  const addSupportingCharacter = () => {
    setSettings(prev => ({
      ...prev,
      supportingCharacters: [
        ...prev.supportingCharacters,
        { name: '', role: '', personality: '' }
      ]
    }))
  }

  const removeSupportingCharacter = (index) => {
    setSettings(prev => ({
      ...prev,
      supportingCharacters: prev.supportingCharacters.filter((_, i) => i !== index)
    }))
  }

  const copyDocumentation = () => {
    navigator.clipboard.writeText(DOCUMENTATION)
      .then(() => {
        alert('已複製到剪貼簿！')
      })
      .catch(err => {
        console.error('複製失敗：', err)
      })
  }

  return (
    <div className="character-form-container">
      <div className="docs-section">
        <button 
          className="toggle-docs-button"
          onClick={() => setShowDocs(!showDocs)}
        >
          {showDocs ? '隱藏說明文件' : '查看說明文件'}
        </button>
        {showDocs && (
          <div className="docs-content">
            <pre>{DOCUMENTATION}</pre>
            <button 
              className="copy-docs-button"
              onClick={copyDocumentation}
            >
              複製說明文件
            </button>
          </div>
        )}
      </div>

      <form className="character-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>主要角色設定</h3>
          <div className="character-inputs">
            <div className="input-group">
              <label>姓名</label>
              <input
                type="text"
                value={settings.mainCharacter.name}
                onChange={(e) => handleChange('mainCharacter', 'name', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>身份</label>
              <input
                type="text"
                value={settings.mainCharacter.role}
                onChange={(e) => handleChange('mainCharacter', 'role', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>性格</label>
              <input
                type="text"
                value={settings.mainCharacter.personality}
                onChange={(e) => handleChange('mainCharacter', 'personality', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>次要角色設定</h3>
          <div className="character-inputs">
            <div className="input-group">
              <label>姓名</label>
              <input
                type="text"
                value={settings.secondCharacter.name}
                onChange={(e) => handleChange('secondCharacter', 'name', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>身份</label>
              <input
                type="text"
                value={settings.secondCharacter.role}
                onChange={(e) => handleChange('secondCharacter', 'role', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>性格</label>
              <input
                type="text"
                value={settings.secondCharacter.personality}
                onChange={(e) => handleChange('secondCharacter', 'personality', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>配角設定</h3>
            <button 
              type="button" 
              className="add-character-button"
              onClick={addSupportingCharacter}
            >
              ＋ 新增配角
            </button>
          </div>
          {settings.supportingCharacters.map((char, index) => (
            <div key={index} className="supporting-character">
              <div className="character-inputs">
                <div className="input-group">
                  <label>姓名</label>
                  <input
                    type="text"
                    value={char.name}
                    onChange={(e) => handleChange('supportingCharacters', 'name', e.target.value, index)}
                  />
                </div>
                <div className="input-group">
                  <label>身份</label>
                  <input
                    type="text"
                    value={char.role}
                    onChange={(e) => handleChange('supportingCharacters', 'role', e.target.value, index)}
                  />
                </div>
                <div className="input-group">
                  <label>性格</label>
                  <input
                    type="text"
                    value={char.personality}
                    onChange={(e) => handleChange('supportingCharacters', 'personality', e.target.value, index)}
                  />
                </div>
                <button 
                  type="button"
                  className="remove-character-button"
                  onClick={() => removeSupportingCharacter(index)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="form-section">
          <h3>故事設定</h3>
          <div className="story-inputs">
            <div className="input-group">
              <label>關係</label>
              <input
                type="text"
                value={settings.relationship}
                onChange={(e) => handleChange('relationship', null, e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>主題</label>
              <input
                type="text"
                value={settings.theme}
                onChange={(e) => handleChange('theme', null, e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>發展方向</label>
              <input
                type="text"
                value={settings.development}
                onChange={(e) => handleChange('development', null, e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>背景</label>
              <input
                type="text"
                value={settings.background}
                onChange={(e) => handleChange('background', null, e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>對話風格</label>
              <input
                type="text"
                value={settings.style}
                onChange={(e) => handleChange('style', null, e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>篇幅</label>
              <input
                type="text"
                value={settings.length}
                onChange={(e) => handleChange('length', null, e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>結局類型</label>
              <input
                type="text"
                value={settings.ending}
                onChange={(e) => handleChange('ending', null, e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="generate-button">
          生成模板
        </button>
      </form>
    </div>
  )
}

export default CharacterForm 