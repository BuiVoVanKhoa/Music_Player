// Gọi nút play bằng cách tìm nút có class 'amplitude-play-pause'
const playButton = document.querySelector(".amplitude-play-pause");
// Gọi nút prev, next, và shuffle
const prevButton = document.querySelector(".amplitude-prev");
const nextButton = document.querySelector(".amplitude-next");
const shuffleButton = document.querySelector(".amplitude-shuffle");
const repeatButton = document.querySelector(".amplitude-repeat-song");
const playlist = document.querySelector(".playlist");

// Gọi biểu tượng âm thanh
const muteIcon = document.querySelector(".amplitude-mute");
const volumeSlider = document.querySelector(".amplitude-volume-slider");

const songs = [
  {
    name: "Duyên Âm x Đánh Đố",
    artist: "QTrung Remix",
    album: "Nhạc của tôi",
    url: "./music/duyenam.mp3",
    cover_art_url: "./images/duyenam.jpg",
  },
  {
    name: "4 Mùa Thương Em",
    artist: "Lập Nguyên x Yến",
    album: "Nhạc của tôi",
    url: "./music/4muathuongem.mp3",
    cover_art_url: "./images/4muathuongem.jpg",
  },
  {
    name: "Chàng Trai Bất Tử",
    artist: "An Vũ",
    album: "Nhạc của tôi",
    url: "./music/changtraibattu.mp3",
    cover_art_url: "./images/changtraibattu.jpg",
  },
  {
    name: "Con Đường Mưa",
    artist: "Nguyễn Văn Chung",
    album: "Nhạc của tôi",
    url: "./music/conduongmua.mp3",
    cover_art_url: "./images/conduongmua.jpg",
  },
  {
    name: "Em Có Nhớ Anh Không",
    artist: "Hiya x Freak D",
    album: "Nhạc của tôi",
    url: "./music/emconhoanhkhong.mp3",
    cover_art_url: "./images/emconhoanhkhong.jpg",
  },
  {
    name: "Ghé Qua",
    artist: "Dick x Tofu x PC",
    album: "Nhạc của tôi",
    url: "./music/ghequa.mp3",
    cover_art_url: "./images/ghequa.jpg",
  },
  {
    name: "Nắm Bàn Tay Say Cả Đời",
    artist: "Đạt Trần x Nâu",
    album: "Nhạc của tôi",
    url: "./music/nambantaysaycadoi.mp3",
    cover_art_url: "./images/nambantaysaycadoi.jpg",
  },
  {
    name: "Tháng 12 Anh Có",
    artist: "Kidz",
    album: "Nhạc của tôi",
    url: "./music/thang12anhco.mp3",
    cover_art_url: "./images/thang12anhco.jpg",
  },
];

// Truyền mảng songs vào Amplitude
Amplitude.init({
  songs: songs,
  callbacks: {
    song_change: function () {
      // Lấy vị trí của bài hát hiện tại khi thay đổi bài hát
      const currentIndex = Amplitude.getActiveIndex();

      // Cập nhật vị trí hiện tại vào app và render lại giao diện
      app.currentIndex = currentIndex;
      app.render(); // Cập nhật danh sách bài hát với trạng thái mới
    },
  },
});

// Tạo danh sách bài hát
const app = {
  songs: songs,
  currentIndex: 0,
  isMuted: false,

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
       <div class="song ${
         index === this.currentIndex ? "active" : ""
       }" data-index="${index}">
      <div class="thumb" style="background-image: url('${song.cover_art_url}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.artist}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>
      `;
    });
    playlist.innerHTML = htmls.join("");
  },

  highlightPlayingSong: function (index) {
    document.querySelectorAll(".song").forEach((element) => {
      element.classList.remove("active");
    });
    const playingSong = document.querySelector(`.song[data-index="${index}"]`);
    if (playingSong) {
      playingSong.classList.add("active");
    }
  },

  handleEvent: function () {
    const _this = this;
    const cd = document.querySelector(".cd");
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    const cdAnimate = cd.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 24000,
        iterations: Infinity,
      }
    );
    cdAnimate.pause();

    // Thêm sự kiện click vào nút play
    playButton.addEventListener("click", function () {
      // Kiểm tra trạng thái của Amplitude để biết nhạc đang phát hay tạm dừng
      if (Amplitude.getPlayerState() === "playing") {
        cdAnimate.play();
      } else {
        cdAnimate.pause();
      }
    });

    // Thêm sự kiện click vào nút prev
    prevButton.addEventListener("click", function () {
      Amplitude.playSongAtIndex(_this.currentIndex); // Phát bài hát trước đó
      _this.render(); // Cập nhật danh sách với bài hát active
      if (Amplitude.getPlayerState() === "playing") {
        cdAnimate.play();
      } else {
        cdAnimate.pause();
      }
    });

    // Thêm sự kiện click vào nút next
    nextButton.addEventListener("click", function () {
      Amplitude.playSongAtIndex(_this.currentIndex); // Phát bài hát kế tiếp
      _this.render(); // Cập nhật danh sách với bài hát active
      if (Amplitude.getPlayerState() === "playing") {
        cdAnimate.play();
      } else {
        cdAnimate.pause();
      }
    });

    // Thêm sự kiện click vào nút shuffle
    shuffleButton.addEventListener("click", function () {
      // Bật hoặc tắt chế độ phát ngẫu nhiên và đổi màu nút
      this.classList.toggle("active");
    });

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode) {
        _this.currentIndex = songNode.dataset.index;
        Amplitude.playSongAtIndex(_this.currentIndex); // Phát bài hát đã chọn
        _this.render();
      }
    };

    // Xử lý sự kiện thay đổi âm lượng
    volumeSlider.addEventListener("input", function () {
      const volumeValue = this.value;

      // Cập nhật âm lượng của Amplitude
      Amplitude.setVolume(volumeValue);

      // Cập nhật biểu tượng loa dựa trên giá trị âm lượng
      if (volumeValue == 0) {
        muteIcon.style.backgroundImage =
          "url('./images/volume_off_24dp_000000.svg')"; // Hình ảnh loa tắt
      } else if (volumeValue >= 80) {
        muteIcon.style.backgroundImage =
          "url('./images/volume_up_24dp_000000.svg')"; // Hình ảnh loa to
      } else {
        muteIcon.style.backgroundImage =
          "url('./images/volume_down_24dp_000000.svg')"; // Hình ảnh loa bình thường
      }
    });

    // Xử lý sự kiện click vào biểu tượng loa
    muteIcon.addEventListener("click", function () {
      _this.isMuted = !_this.isMuted; // Chuyển đổi trạng thái tắt/mở âm thanh
      if (_this.isMuted) {
        Amplitude.setVolume(0); // Tắt âm thanh
        muteIcon.style.backgroundImage =
          "url('./images/volume_off_24dp_000000.svg')"; // Hình ảnh loa tắt
      } else if (volumeSlider.value > 80) {
        Amplitude.setVolume(volumeSlider.value);
        muteIcon.style.backgroundImage =
          "url('./images/volume_up_24dp_000000.svg')";
      } else {
        Amplitude.setVolume(volumeSlider.value); // Bật âm thanh với âm lượng hiện tại
        muteIcon.style.backgroundImage =
          "url('./images/volume_down_24dp_000000.svg')"; // Hình ảnh loa bật
      }
    });

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
  },

  start: function () {
    this.render();
    this.handleEvent();
  },
};

app.start();

// Bắt sự kiện cho nút lặp lại và đổi màu khi kích hoạt
repeatButton.addEventListener("click", function () {
  this.classList.toggle("active"); // Thêm hoặc xóa lớp active để đổi màu
});
