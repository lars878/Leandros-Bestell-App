const messages = [
    "Order being processed...",
    "----------",
    "WARNING: unhealthy food detected...",
    "Too much calories to process...",
    "System status CRITICAL due to fat overflow...",
    "Applying patch: 'try_salad()' - system recovery in progress...",
    "----------",
    "System health restored. Enjoy your salad.",
    "----------",
  ];
  
  let content = "";
  let currentMessageIndex = 0;
  
  // create html structure with empty message divs
  function startTyping() {
    openPopup();
    resetBasket();
    content = "";
    for (let i = 0; i < messages.length; i++) {
      content += `<div id="message_${i}"></div>`;
    }
    document.getElementById("popup_container").innerHTML = content;
    typeText(messages[currentMessageIndex], "message_" + currentMessageIndex); // first call
  }
  
  // fill a single message div (live-typing)
  // innerType() comes from: https://www.w3schools.com/howto/howto_js_typewriter.asp
  function typeText(message, targetId) {
    let index = 0;
  
    function innerType() {
      if (index < message.length) {
        document.getElementById(targetId).innerHTML += message.charAt(index);
        index++;
        setTimeout(innerType, 20);
      } else {
        onTypingFinished(); // pass to next message
      }
    }
    innerType();
  }
  
  function onTypingFinished() {
    currentMessageIndex++;
    if (currentMessageIndex < messages.length) {
      setTimeout(function () {
        typeText(messages[currentMessageIndex], "message_" + currentMessageIndex);
      }, 1000);
    }
  }
  
  function openPopup() {
    document.getElementById('overlay').classList.remove('d-none');
  }
  
  function closePopup() {
    document.getElementById('overlay').classList.add('d-none');
    document.getElementById("popup_container").innerHTML = ""; 
    currentMessageIndex = 0; 
  }
    