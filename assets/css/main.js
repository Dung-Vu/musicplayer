const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'REPEAT_RANDOM'

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name:'Bạn Đời',
            singer:'Karik-GDucky',
            path:'music/BanDoi.mp3',
            image:'img/bandoi.jpg',
        },
        {
            name:'Blue Tequila',
            singer:'Táo',
            path:'music/BlueTequila.mp3',
            image:'img/bluetequila.jpg',
        },
        {
            name:'Chịu Cách Mình Nói Thua',
            singer:'Ryder',
            path:'music/ccmnt.mp3',
            image:'img/ccmnt.jpg',
        },
        {
            name:'Dân Chơi Sao Phải Khóc',
            singer:'Andree Righ Hand-Ryder',
            path:'music/dcspk.mp3',
            image:'img/dcspk.jpg',
        },
        {
            name:'Nấu Ăn Cho Em',
            singer:'Đen',
            path:'music/nace.mp3',
            image:'img/nace.jpg',
        },
        {
            name:'Sau Lời Từ Khước',
            singer:'Phan Mạnh Quỳnh',
            path:'music/SauLoiTuKhuoc.mp3',
            image:'img/SauLoiTuKhuoc.jpg',
        }
    ],

    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function () {
        const htmls = this.songs.map((song, index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
                </div>
            `
        }) 
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iteration: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth ;
        }

        // Xử lý khi click play-pause
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime 
        }

        // next song
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // prev song
        prevBtn.onclick = function() {
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // Xử lý khi lặp lại song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // Xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play()
            }else{
            nextBtn.click()
            }
        } 
        // Lắng nghe hành vi khi click vào list song
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if(songNode || e.target.closest('.option')){
                // Xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lý khi click vào song option
                if(e.target.closest('.option')){

                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout( () => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        },300)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex <0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while ( newIndex === this.currentIndex )
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        // Gán cấu hình từ config vào web
        this.loadConfig()
        // Định nghĩa thuộc tính cho opject
        this.defineProperties()

        // Lắng nghe/ xử lý các sự kiện (Dom event)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render Playlist
        this.render()

        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()
