import axios from 'axios';
import Peer from 'peerjs';


const createPeerConnection = () => {
//Need to pass in amibitId and username/uId to function to pass to get 

  var peer = new Peer({
    key: '7inh9zl1wy9l766r',
    debug: 3,
    config: {'iceServers': [
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'turn:numb.viagenie.ca',
      credential: 'muazkh', username: 'webrtc@live.com' }
    ]}
  });

  var peerId, conn;
  var ambitName = 'TEST'; 
  // console.log('Peer ID is', peerId['id']);


  peer.on('open', (id) => {
    peerId = id;
    console.log('Peer ID is', peerId);
    console.log(peer);
    conn = peer.connect(peerId, {metadata: {
      'username': 'Emerson' //username
    }});
    axios.post('/live', {peerId: peerId, ambitId: 'em', user: 'Emerson'})
    .then(response => console.log(response))
    .catch(err => console.error('Error posting peer ID to server', err));
  });
  

  function getVideo(callback){
    navigator.getUserMedia({audio: true, video: true}, callback, error => {
      console.error(error);
      alert('An error occured. Please try again');
    });
  }

  getVideo(stream => {
    window.localStream = stream;
    console.log(window.localStream);
    // onReceiveStream(stream, 'my-camera');
  });



  peer.on('call', call => {
    onReceiveCall(call);
  });

  function onReceiveCall(call){
    call.answer(window.localStream);
  }

  peer.on('close', () => {
    axios.delete('/live', {peerId: peerId})
    .then(response => console.log(response))
    .catch(err => console.error('Error sending delete request to server', err));
  });

  peer.on('connection', (conn) => {
    console.log('connect!!!', conn);
  });

};

export default createPeerConnection;
