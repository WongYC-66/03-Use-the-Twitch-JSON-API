window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#allBtn').onclick = () => {
      let nodeList = document.querySelector('#streamerRow').childNodes
      updateShowOrHide(nodeList, 'show');
      updateButtonColor(document.querySelector('#allBtn'));
    }
    document.querySelector('#onlineBtn').onclick = () => {
      let nodeList = document.querySelectorAll('#streamerRow >div.online')
      updateShowOrHide(nodeList, 'show');
      nodeList = document.querySelectorAll('#streamerRow >div.offline')
      updateShowOrHide(nodeList, 'hide');
      updateButtonColor(document.querySelector('#onlineBtn'));
    }
    document.querySelector('#offlineBtn').onclick = () => {
      let nodeList = document.querySelectorAll('#streamerRow >div.online')
      updateShowOrHide(nodeList, 'hide');
      nodeList = document.querySelectorAll('#streamerRow >div.offline')
      updateShowOrHide(nodeList, 'show');
      updateButtonColor(document.querySelector('#offlineBtn'));
    }
  })
  
  const twitchChannels = [
    'freecodecamp',
    'Fextralife',
    'tarik',
    'xQc',
    'Ninja',
    'Pokimane',
    'Jinnytty',
    'TommyInnit',
    'SypherPK',
    'Kyedae',
    'EsfandTV',
    'jingggxd',
    'ESL_SC2',
  ]
  // main
  const channelInfo = {}
  getTwitchData()
  
  // 
  
  async function getTwitchData(){
    let queryString = twitchChannels.join('&login=')
    //1. get id/name/profileImgUrl
    await fetch(`https://twitch-proxy.freecodecamp.rocks/helix/users?login=${queryString}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        data.data.forEach(x => {
          // console.log(x)
          let obj = {
            loginName : x.login,
            profileImg : x.profile_image_url,
            displayName : x.display_name 
          };
          let id = parseInt(x.id)
          channelInfo[id] = obj
        });
        console.log(channelInfo)
      });
    console.log('after await fetch')
    //2. get live or not / game_streaming
    queryString = twitchChannels.join('&user_login=')
    console.log(queryString)
    await fetch(`https://twitch-proxy.freecodecamp.rocks/helix/streams?user_login=${queryString}`)
      .then(res => res.json())
      .then(data => {
        data = data.data
        console.log(data)
        data.forEach(x => {
          channelInfo[x.user_id]['isLive'] = x.type
          channelInfo[x.user_id]['game_name'] = x.game_name
          channelInfo[x.user_id]['title'] = x.title
        })
      })
    console.log('after await fetch 2')
    console.log(channelInfo)
    insertStreamerRow();
  }
  
  function insertStreamerRow(){
    console.log('insert streamer row...')
    console.log(Object.keys(channelInfo))
    
    let sorted_id = [] //sort online to front
    for([key, value] of Object.entries(channelInfo)){
      console.log({key,value})
      value.isLive ? sorted_id.unshift(key) : sorted_id.push(key)
    }
    
    for(let x of sorted_id){
      // console.log(x)
      const node = document.createElement("div");
      node.classList.add("show");
      const subNode1 = document.createElement("img");
      const subNode2 = document.createElement("a");
      const subNode3 = document.createElement("p");
      subNode1.setAttribute('src', channelInfo[x].profileImg)
      subNode2.innerHTML = channelInfo[x].displayName
      subNode2.classList.add("name");
      subNode2.href = `https://www.twitch.tv/${channelInfo[x].loginName}`
      subNode2.target = "_blank"
      subNode3.classList.add("game_play");
      subNode3.innerHTML = channelInfo[x].isLive ? channelInfo[x].game_name + ". " + channelInfo[x].title : "Offline" ;
      if(channelInfo[x].isLive){
        node.classList.add("online");
      } else {
        node.classList.add("offline");
      }
      node.appendChild(subNode1);
      node.appendChild(subNode2);
      node.appendChild(subNode3);
      document.getElementById("streamerRow").appendChild(node);
    }
  }
  
  function updateShowOrHide(nodeList, isShow){
    for(let x of nodeList){
      if(isShow === 'show'){
        x.classList.remove("hide");
        x.classList.add("show");
      } else {
        x.classList.remove("show");
        x.classList.add("hide");
      }
    }
  }
  
  function updateButtonColor(element){
    console.log(element)
    let nodeList = document.querySelectorAll('#allBtn, #onlineBtn, #offlineBtn')
    for(let x of nodeList) x.classList.remove("selected");
    element.classList.add('selected')
  }
  