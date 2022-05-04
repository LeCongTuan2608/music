const $ = document.querySelector.bind(document); // tương tự với getElementByID
const $$ = document.querySelectorAll.bind(document); // query: Truy vấn tới các đối tượng
const audio = document.getElementById("audio"); //getElementById: lấy giá tri theo id
const play = document.querySelector(".play"); //querySelector: truy vấn và trả về phần tử đầu tiên
const next = document.querySelector(".play-forward");
const pre = document.querySelector(".play-back");
const durationTime = document.querySelector(".duration");
const remainingTime = document.querySelector(".remaining");
const rangebar = document.querySelector(".range");
const musicName = document.querySelector(".music-name");
const singerName = document.querySelector(".singer-name");
const musicThumbnail = document.querySelector(".music-thumb");// biến để khi ấn play thumb sẽ quay 
const musicImage = document.querySelector(".music-thumb img ");
const playRepeat = document.querySelector(".play-repeat"); // repeat: nói lại (dịch)
const playInfinite = document.querySelector(".play-infinite");//infinite: vô hạn (dịch)
const listsong = document.querySelector(".list-song")

let isPlaying = true; // tạo biến đang phát bài nhạc
let indexSong = 0; // biến đếm 
let isRepeat = false; // tạo biến phát lại bài hát 1 lần
let isInfinite = false; // tạo biến phát lại bài hát vô hạn

window.addEventListener("load", ()=>{
    loading(indexSong);
    Browse_list();
})

const musics = [ // một cái mảng bài hat gồm có các thông tin như (id, tên, địa chỉ, ảnh ...)
    {
        id: 0,
        title: "Cưới Thôi",
        singer: "Masew, Masiu",
        File: "cưới thôi.mp3",
        Image: "https://data.chiasenhac.com/data/thumb/2194/2193713_prv.jpg"
    },

    {
        id: 1,
        title: "Super idol",
        singer: "Heiakim",
        File: "Super Idol.mp3",
        Image: "images/superidol.jpg"
    },
    
    {
        id: 2,
        title: "Họ Yêu Ai Mất Rồi-lofi",
        singer: "Doãn Hiếu",
        File: "Họ Yêu Ai Mất Rồi.mp3",
        Image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/2/0/c/8/20c8208e735601981e8d3b85b3d4cacd.jpg"
    },

    {
        id: 3,
        title: "Bên Nhau Thật Khó",
        singer: "Châu Khải Phong, Khang Việt",
        File: "BenNhauThatKho.mp3",
        Image: "https://avatar-ex-swe.nixcdn.com/song/2017/10/01/7/0/8/9/1506836123432_640.jpg"
    },

    {
        id: 4,
        title: "Độ Tộc 2",
        singer: "MASEW x PHÚC DU x PHÁO x ĐỘ MIXI",
        File: "ĐỘ TỘC 2.mp3",
        Image: "https://i.ytimg.com/vi/Jk38OqdAQxc/maxresdefault.jpg"
    },

    {
        id: 5,
        title: "Người Lạ Thoáng Qua",
        singer: "Đinh Tùng Huy",
        File: "Người Lạ Thoáng Qua.mp3",
        Image: "https://i.ytimg.com/vi/ZuSHTuOvSGc/maxresdefault.jpg"
    },

    {
        id: 6,
        title: "Biết Tìm Đâu-lofi",
        singer: "Tiến Tới x Freak D",
        File: "Biết Tìm Đâu.mp3",
        Image: "https://i.ytimg.com/vi/gkN8cXY2X0U/maxresdefault.jpg"
    },

    {
        id: 7,
        title: "Phố Đã Lên Đèn",
        singer: "Masew, Masiu",
        File: "Phố Đã Lên Đèn.mp3",
        Image: "https://i.ytimg.com/vi/YnqGDAcx3lA/maxresdefault.jpg"
    },

    {
        id: 8,
        title: "Thương Em Đến Già",
        singer: "Lê Bảo Bình",
        File: "Thương Em Đến Già.mp3",
        Image: "https://data.chiasenhac.com/data/cover/152/151778.jpg"
    },
]

let time; // tạo biến thời gian
let repeatCount = 0; // tạo biến đếm 
let infiniteCount = 0; // tạo biến đếm 

//begin xử lí vòng lặp 1 lần
playRepeat.addEventListener("click", function(){ // addEventListener: lệnh để thêm sự kiện để xử lí
    if(isRepeat) {  //nếu isRepeat = True thì làm những cái bên dưới
        repeatCount = 1;
        isRepeat = false;
        playRepeat.removeAttribute("style"); // removeAttribute: xóa thuộc tính bên trong
    }
    else { // ngược lại nếu isPepeat = false thì làm cái bên dưới
        repeatCount = 0;
        isRepeat = true;
        playRepeat.style.color = "red";
    }
});//end

//begin xử lí vòng lặp vô hạn
playInfinite.addEventListener("click", function(){ // addEventListener: lệnh để thêm sự kiện để xử lí
    if(isInfinite) {        //nếu isInfinite = True thì làm những cái bên dưới
        infiniteCount++;
        isInfinite = false;
        playInfinite.removeAttribute("style"); // removeAttribute: xóa thuộc tính bên trong
    }
    else {      // ngược lại nếu isInfinite = false thì làm cái bên dưới
        infiniteCount = 0;
        isInfinite = true;
        playInfinite.style.color = "red";
    }
});//end

next.addEventListener("click", function(){ 
    changeSong(1); 
});
pre.addEventListener("click", function(){ 
    changeSong(-1);
});
audio.addEventListener("ended", handleendedSong);

//begin hàm xử lí các thao tác 
function handleendedSong(){ // handle: xử lí (dịch)
    repeatCount++; 
    infiniteCount++;
    // lặp lại bài hát 1 lần
    if(isRepeat && repeatCount == 1){ // nếu isPepeat = true và repeatCount == 1 thì làm những lệnh bên dưới
        isPlaying = true;
        playPause();
        playRepeat.removeAttribute("style");
    }else if(isInfinite && infiniteCount){ //nếu isInfinite = true và infiniteCount == 1 thì làm 
        isPlaying = true;
        playPause();
    }else{
        changeSong(1);
    }
}
function changeSong(dir) { // changesong: chuyển bài hát (dịch)
    if(dir == 1){
        //next song
        indexSong++;
        isPlaying = true;
        if (indexSong >= musics.length){
            indexSong = 0;
            isPlaying = false;
        }
    }else if(dir == -1){
        //pre song
        indexSong--;
        if(indexSong < 0){
            indexSong = musics.length-1;
        }
        isPlaying = true;
    }
    loading(indexSong);
    Browse_list();
    playPause();
}
play.addEventListener("click", playPause);
function playPause() {
    if(isPlaying){
        musicThumbnail.classList.add("is-playing"); // classList.add: Hàm này sẽ thêm một class vào thẻ html
        audio.play();
        play.innerHTML = '<ion-icon name="pause"></ion-icon>'; // innerHTML: Thiết lập nội dung cho một thẻ html
        isPlaying = false;
        time = setInterval(displayTime, 500);
    }else{
        musicThumbnail.classList.remove("is-playing");
        audio.pause();
        play.innerHTML = '<ion-icon name="play"></ion-icon>';
        isPlaying = true;
        clearInterval(time);
    }
}//end

// hàm hiển thị thời gian bài hát
function displayTime() {
    const {duration, currentTime } = audio;
    rangebar.max = duration; //duration: khoảng thời gian
    rangebar.value = currentTime; // currentTime: thời điểm hiện tại
    remainingTime.textContent = formatTime(currentTime) // textContent: Trả về 1 chuỗi ký tự chứa nội dung của tất cả thẻ văn bản bên trong phần tử hiện tại
    if (!duration){
        durationTime.textContent = "00:00";
    }else{
        durationTime.textContent = formatTime(duration);
    }
}//end

//hàm dịnh dạng lại thời gian
function formatTime(number){ //format = chỉnh định dạng số phút
    const minutes = Math.floor(number / 60); // floor: làm tròn số , Math: hàm tính toán
    const seconds = Math.floor(number - minutes * 60);
    return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds:seconds}`;
}//end

rangebar.addEventListener("change", handleChangeBar);
function handleChangeBar(){
    audio.currentTime = rangebar.value; // currentTime: lấy giá trị thời gian
}

//updata lại dữ liệu để hiển thị
function loading(indexSong) {
    displayTime();
    musicImage.setAttribute("src", musics[indexSong].Image); // setAttribute: thêm thuộc tính đã chỉ định vào một phần tử và cung cấp cho nó giá trị được chỉ định.
    musicName.textContent = musics[indexSong].title;
    singerName.textContent = musics[indexSong].singer;
    audio.setAttribute("src", `./music/${musics[indexSong].File}`);
}

//hàm danh sách bài hát
function list() {
    for (let index = 0; index < musics.length; index++) {
        let NameSong = `<div class="song" index="${index}">
                            <img src="${musics[index].Image}">
                            <h3>${musics[index].title}</h3>
                            <h5>${musics[index].singer}</h5>
                        </div>`;
        listsong.insertAdjacentHTML("beforeend", NameSong);
    }
}//end
list();

//Hàm duyệt danh sách bài hát và click
function Browse_list(){
    let allSong = listsong.querySelectorAll(".song");
    for (let j = 0; j < allSong.length; j++) {
        if(allSong[j].classList.contains("is_playing")){
            allSong[j].classList.remove("is_playing");
        }
        if (allSong[j].getAttribute("index") == indexSong) {
            allSong[j].classList.add("is_playing");
        }
        allSong[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element){
    let getIndex = element.getAttribute("index");
    indexSong = getIndex;
    loading(indexSong);
    audio.play();
    isPlaying = true;
    playPause();
    Browse_list();
}//end


// call API music 

const keyWord = document.querySelector(".search_name"); // lấy dữ liệu từ thanh tìm kiếm
// const url = 'https://www.googleapis.com/youtube/v3/search?'; 
// const parameter = 'part=snippet&maxResults=5&type=video';
// const apiKey = 'AIzaSyArduLszOeBXxOQfYg6iCRENRUYhJUx5Oo'; // key api
// function search(){
//     fetch(url + parameter + '&q=' + keyWord.value + '&key=' + apiKey)
//     .then(async data => data.json())
//     // .then(data => console.log(data));

//     .then(function(data){
//         console.log(data.items);
//         search_results(data);
//     })
// }


function Search(){
const url = 'https://spotify23.p.rapidapi.com/search/?q='; 
const parameter = '&type=multi&offset=0&limit=10&numberOfTopResults=5';
    fetch(url + keyWord.value + parameter, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "spotify23.p.rapidapi.com",
            "x-rapidapi-key": "2edda24c7cmsheefa39a51ba55ffp184063jsn95c71f55fe2e"
        }
    })
    .then(async data => data.json())
    // .then(data => console.log(data));
    .then(data => {
        console.log(data);
        search_results(data);
    })

}

function search_results(data){
    // var url_youtube = 'https://www.youtube.com/embed/';
    for (let index = 0; index < data.tracks.items.length; index++) {
        // var id_video = data.items[index].id.videoId;
        var title_music = data.tracks.items[index].data.name;
        var singer_name =  data.tracks.items[index].data.artists.items[0].profile.name;
        var thumb = data.tracks.items[index].data.albumOfTrack.coverArt.sources[2].url;
        var output = `
        <div class="song" index="${index+9}">
            <img src="${thumb}">
            <h3>${title_music}</h3>
            <h5 class="singer-name">${singer_name}</h5>
        </div>`;
        listsong.insertAdjacentHTML("beforeend", output);
    }
}

const btn_submit = document.querySelector(".btn_submit");
btn_submit.addEventListener("click", function(){
    Search();
})
