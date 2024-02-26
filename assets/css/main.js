const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = {
    currentIndex: 0,
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

    render: function () {
        const htmls = this.songs.map(song =>{
            return `
                <div class="song">
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
        $('.playlist').innerHTML = htmls.join('')
    },
    handleEvents: function(){
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth ;
        }
    },
    start: function() {
        // Định nghĩa thuộc tính cho opject

        // Lắng nghe/ xử lý các sự kiện (Dom event)
        this.handleEvents()
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        
        // Render Playlist
        this.render()
    }
}

app.start()
