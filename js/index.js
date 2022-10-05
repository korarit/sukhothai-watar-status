const { createApp } = Vue
const { ref } = Vue

const api = [
    {
        "station_name": "อ.วังชิ้น จ.แพร่",
        "station_id": "3127",
        "type": "hour",
        "station_lat": "17.90123715000642",
        "station_lon": "99.60560199759567"
    },
    {
        "station_name": "ต.แม่สำ อ.ศรีสัชนาลัย จ.สโขทัย",
        "station_id": "632512",
        "type": "hour",
        "station_lat": "17.59536",
        "station_lon": "99.71633"
    },
    {
        "station_name": "ต.หาดเสี้ยว อ.ศรีสัชนาลัย จ.สโขทัย",
        "station_id": "647",
        "type": "min",
        "station_lat": "17.517251",
        "station_lon": "99.758682"
    },
    {
        "station_name": "คลองหกบาท อ.สวรรคโลก จ.สโขทัย",
        "station_id": "652",
        "type": "min",
        "station_lat": "17.366027523405606",
        "station_lon": "99.84343816822161"
    },
    {
        "station_name": "ต.เมืองสวรรคโลก อ.สวรรคโลก จ.สโขทัย",
        "station_id": "3041",
        "type": "hour",
        "station_lat": "17.306282647665917",
        "station_lon": "99.8298322691176"
    },
    {
        "station_name": "ต.ท่าทอง อ.สวรรคโลก จ.สโขทัย",
        "station_id": "653",
        "type": "min",
        "station_lat": "17.201856856694132",
        "station_lon": "99.86403511344358"
    },
    {
        "station_name": "ต.คอลงตาล อ.ศรีสำโรง จ.สโขทัย",
        "station_id": "3017",
        "type": "hour",
        "station_lat": "17.16880894650453",
        "station_lon": "99.86099532777027"
    },
    {
        "station_name": "เมืองสุโขทัย ต.ธานี อ.เมือง จ.สโขทัย",
        "station_id": "640",
        "type": "min",
        "station_lat": "17.021181416993198",
        "station_lon": "99.81963113682606"
    },
    {
        "station_name": "ต.ธานี อ.เมือง จ.สโขทัย",
        "station_id": "2986",
        "type": "hour",
        "station_lat": "17.00585340306209",
        "station_lon": "99.82270928137218"
    },
    {
        "station_name": "ต.กง อ.กงไกรลาศ จ.สโขทัย",
        "station_id": "645",
        "type": "min",
        "station_lat": "16.927399944975235",
        "station_lon": "99.95939841599703"
    },
    {
        "station_name": "ต.ชุมแสงสงคราม อ.บางระกำ จ.พิษณุโลก",
        "station_id": "665",
        "type": "min",
        "station_lat": "16.85849591815284",
        "station_lon": "100.0595943118836"
    }
]

var marker = [];
let markers = [];
createApp({

    setup() {

        const dates = new Date();
        let date_now = dates.getFullYear() + "-" + (dates.getMonth() + 1) + '-' + dates.getDate();
        let date_show = dates.getDate() + "/" + (dates.getMonth() + 1) + '/' + dates.getFullYear();
        let hour_now = dates.getHours() + ":" + dates.getMinutes();
        let three_hour = dates.getHours() - 3;
        //console.log(three_hour)

        const more = (id) => {

            if (api[id]["type"] === 'hour') {

                axios.get("https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_graph?station_type=tele_waterlevel&station_id=" + api[id]["station_id"] + "&start_date=" + date_now + '&end_date=' + date_now + ' ' + hour_now
                ).then(res => {
                    var data_water = res.data.data.graph_data;
                    var ground_level = res.data.data.ground_level;
                    var min_bank = res.data.data.min_bank;
                    let status_water = null;

                    var html = '';
                    for (let count_data = 0; count_data < data_water.length; count_data++) {

                        //ดึงเวลา
                        if (data_water[count_data]["value"] != null) {

                            var get_time = new Date(data_water[count_data]["datetime"]);
                            var time = get_time.getHours() + ":" + ("0" + get_time.getMinutes()).slice(-2);
                            //ดีงปริมาณน้ำ และคำนวณ
                            var value_water = Number((data_water[count_data]["value"] - ground_level).toFixed(2));
                            //คำนวณ ความสูงตลิ่ง
                            var height_river = Number((min_bank - ground_level).toFixed(2));
                            //คำนวณ ปริมาณน้ำเป็น %
                            var precent_water = ((value_water / height_river) * 100);

                            //สถานการณ์น้ำ
                            if (precent_water <= 29) {
                                status_water = '<span style="width: 7rem;" class="tag is-info is-medium">ปริมาณน้ำน้อย</span>';
                                //console.log(status_water);
                            } else if (precent_water >= 30 && precent_water < 60) {
                                status_water = '<span style="width: 7rem;" class="tag is-success is-medium">ปริมาณน้าปกติ</span>';
                                //console.log(status_water);
                            } else if (precent_water >= 60 && precent_water < 80) {
                                status_water = '<span style="width: 7rem;" class="tag is-Link is-medium">ปริมาณน้ำมาก</span>';
                                //console.log(status_water);
                            } else if (precent_water >= 80 && precent_water < 100) {
                                status_water = '<span style="width: 7rem;" class="tag is-Warning is-medium">น้ำใกล้ล้นตลิ่ง</span>';
                                //console.log(status_water);
                            } else if (precent_water >= 100) {
                                status_water = '<span style="width: 7rem;" class="tag is-danger is-medium">น้ำล้นตลิ่ง</span>';
                                //console.log(status_water);
                            }

                            html += '</tr>'
                            html += '<th>' + time + 'น.</th>';
                            html += '<td>' + value_water + ' เมตร</td>';
                            html += '<td>' + status_water + '</td>';
                            html += '</tr>';
                        }

                    }

                    Swal.fire({
                        title: '<p style="font-size: 25px">ข้อมูลสถานี ' + api[id]["station_name"] + ' วันที่ ' + date_show + '</p><p style="font-size: 20px">(ความสูงของตลิ่ง : ' + height_river + ' เมตร)' + '</p>',
                        width: 800,
                        html:
                            '<div class="table-container">' +
                            '<table class="table table-hover2" style="width: 740px;">' +
                            '<thead>' +
                            '<th style="width: 8rem;">ข้อมูล ณ เวลา</th>' +
                            '<th style="width: 8rem;">ระดับน้ำ</th>' +
                            '<th style="width: 10rem;">สถานการณ์น้ำ</th>' +
                            '</thead>' +
                            '<tbody>' +
                            html +
                            '</tbody>' +
                            '</table>' +
                            '</div>',
                        showCloseButton: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                        focusConfirm: false
                    })
                }
                )
            }

            if (api[id]["type"] === 'min') {

                axios.get("https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_graph?station_type=tele_waterlevel&station_id=" + api[id]["station_id"] + "&start_date=" + date_now + '&end_date=' + date_now + ' ' + hour_now
                ).then(res => {
                    var data_water = res.data.data.graph_data;
                    var ground_level = res.data.data.ground_level;
                    var min_bank = res.data.data.min_bank;
                    let status_water = null;

                    var html = '';
                    for (let count_data = 0; count_data < data_water.length; count_data++) {

                        //ดึงเวลา
                        if (data_water[count_data]["value"] != null) {
                            var get_time = new Date(data_water[count_data]["datetime"]);
                            if (get_time.getHours() > three_hour) {

                                var time = get_time.getHours() + ":" + ("0" + get_time.getMinutes()).slice(-2);
                                //ดีงปริมาณน้ำ และคำนวณ
                                var value_water = Number((data_water[count_data]["value"] - ground_level).toFixed(2));
                                //คำนวณ ความสูงตลิ่ง
                                var height_river = Number((min_bank - ground_level).toFixed(2));
                                //คำนวณ ปริมาณน้ำเป็น %
                                var precent_water = ((value_water / height_river) * 100);

                                //สถานการณ์น้ำ
                                if (precent_water <= 29) {
                                    status_water = '<span style="width: 7rem;" class="tag is-info is-medium">ปริมาณน้ำน้อย</span>';
                                    //console.log(status_water);
                                } else if (precent_water >= 30 && precent_water < 60) {
                                    status_water = '<span style="width: 7rem;" class="tag is-success is-medium">ปริมาณน้าปกติ</span>';
                                    //console.log(status_water);
                                } else if (precent_water >= 60 && precent_water < 80) {
                                    status_water = '<span style="width: 7rem;" class="tag is-Link is-medium">ปริมาณน้ำมาก</span>';
                                    //console.log(status_water);
                                } else if (precent_water >= 80 && precent_water < 100) {
                                    status_water = '<span style="width: 7rem;" class="tag is-Warning is-medium">น้ำใกล้ล้นตลิ่ง</span>';
                                    //console.log(status_water);
                                } else if (precent_water >= 100) {
                                    status_water = '<span style="width: 7rem;" class="tag is-danger is-medium">น้ำล้นตลิ่ง</span>';
                                    //console.log(status_water);
                                }

                                html += '</tr>'
                                html += '<th>' + time + 'น.</th>';
                                html += '<td>' + value_water + ' เมตร</td>';
                                html += '<td>' + status_water + '</td>';
                                html += '</tr>';
                            }
                        }

                    }

                    Swal.fire({
                        title: '<p style="font-size: 20px">ข้อมูลสถานี ' + api[id]["station_name"] + ' (ย้อนหลัง 2ชั่วโมง)</p><p style="font-size: 18px">(ความสูงของตลิ่ง : ' + height_river + ' เมตร)' + '</p>',
                        width: 700,
                        html:
                            '<div class="table-container">' +
                            '<table class="table table-hover2" style="width: 640px;">' +
                            '<thead>' +
                            '<th style="width: 8rem;">ข้อมูล ณ เวลา</th>' +
                            '<th style="width: 8rem;">ระดับน้ำ</th>' +
                            '<th style="width: 10rem;">สถานการณ์น้ำ</th>' +
                            '</thead>' +
                            '<tbody>' +
                            html +
                            '</tbody>' +
                            '</table>' +
                            '</div>',
                        showCloseButton: true,
                        showCancelButton: false,
                        showConfirmButton: false,
                        focusConfirm: false
                    })
                }
                )
            }
        }
        return {
            more
        }
    },
    data() {

        //ส่วนการทำงานของ การดึงตาราง ระดับน้ำ
        var data = [];

        const dates = new Date();
        let date_now = dates.getFullYear() + "-" + (dates.getMonth() + 1) + '-' + dates.getDate();
        let hour_now = dates.getHours() + ":" + dates.getMinutes();


        for (let i in api) {

            axios.get("https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_graph?station_type=tele_waterlevel&station_id=" + api[i]["station_id"] + "&start_date=" + date_now + '&end_date=' + date_now + ' ' + hour_now
            ).then(res => {
                var data_water = res.data.data.graph_data;
                var ground_level = res.data.data.ground_level;
                var min_bank = res.data.data.min_bank;
                let status_water = null;

                let count_data = data_water.length;
                for (count_data > data_water.length; --count_data;) {

                    //ดึงเวลา
                    if (data_water[count_data]["value"] != null) {

                        var time = new Date(data_water[count_data]["datetime"]);
                        //ดีงปริมาณน้ำ และคำนวณ
                        var value_water = Number((data_water[count_data]["value"] - ground_level).toFixed(2));
                        //คำนวณ ความสูงตลิ่ง
                        var height_river = Number((min_bank - ground_level).toFixed(2));
                        //คำนวณ ปริมาณน้ำเป็น %
                        var precent_water = ((value_water / height_river) * 100);

                        //สถานการณ์น้ำ
                        if (precent_water <= 29) {
                            status_water = 'low_water';
                            //console.log(status_water);
                        } else if (precent_water >= 30 && precent_water < 60) {
                            status_water = 'normal_water';
                            //console.log(status_water);
                        } else if (precent_water >= 60 && precent_water < 80) {
                            status_water = 'very_water';
                            //console.log(status_water);
                        } else if (precent_water >= 80 && precent_water < 100) {
                            status_water = 'a_lot_water';
                            //console.log(status_water);
                        } else if (precent_water >= 100) {
                            status_water = 'overflow_water';
                            //console.log(status_water);
                        }

                        data[i] = {
                            data_id: Number(i),
                            station_id: Number(i) + 1,
                            station_name: api[i]["station_name"],
                            time: time.getHours() + ":" + ("0" + time.getMinutes()).slice(-2),
                            value: String(value_water),
                            height_river: String(height_river),
                            precent_water: String(precent_water.toFixed(2)),
                            status_water: status_water
                        };

                        break;
                    }

                }
                this.datas = ref(data);
                //data_public = data;
                //console.log(this.datas);
            }
            )
        }


        //พยากรณ์อากาศ
        var data_weather = [];
        for (let iz in api) {

            axios.get("/api/now.php?lat=" + api[iz]["station_lat"] + "&lon=" + api[iz]["station_lon"]
            ).then(res => {
                //console.log(res.data.WeatherForecasts[0]["forecasts"][0]["data"]);

                data_weather[iz] = {
                    id:Number(iz) + 1,
                    station_name:api[iz]["station_name"],
                    data:res.data.WeatherForecasts[0]["forecasts"][0]["data"]
                }

                this.data_weather = ref(data_weather);

                document.getElementById('loading_weather').style.display='none';
                document.getElementById('table_weather').style.display='block';
            }
            )
        }

        axios.get("/data/floodgate.json"
            ).then(res => {
                this.floodgate = res.data;

            }
            )

        return {
            names: 'school',
            datas: [],
            data_weather: [],
            floodgate: [],
            time_now: dates.getHours() + ":00"
        }
    },
    methods: {
    },
    metainfo() {
        return {
            meta: [
                { charset: 'utf-8' }
            ]
        }
    },
    mounted() {
        //ส่วน การทำงานของ navbar menu
        const burgericon = document.querySelector('#burger');
        const narbarmenu = document.querySelector('#navbar-links');

        burgericon.addEventListener('click', () => {
            narbarmenu.classList.toggle('is-active');
        })


        //ส่วนลากดู พยากรณ์
        $(window).on("load", function () {
            // set initial container to half of .landing-inner-content width
            //TweenMax.set($landingWrapper, {scrollTo: {x: $landingInnerContent.width()/4}, ease: Power2.easeOut});

            Draggable.create(".landing-inner-content", {
                type: "x",
                bounds: ".landing-wrapper",
                throwProps: true,
            });

        });

    }
}).mount('#app')

function more_data_icon(id){
    const dates = new Date();
    let date_now = dates.getFullYear() + "-" + (dates.getMonth() + 1) + '-' + dates.getDate();
    let date_show = dates.getDate() + "/" + (dates.getMonth() + 1) + '/' + dates.getFullYear();
    let hour_now = dates.getHours() + ":" + dates.getMinutes();
    let three_hour = dates.getHours() - 3;

    if (api[id]["type"] === 'hour') {

        axios.get("https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_graph?station_type=tele_waterlevel&station_id=" + api[id]["station_id"] + "&start_date=" + date_now + '&end_date=' + date_now + ' ' + hour_now
        ).then(res => {
            var data_water = res.data.data.graph_data;
            var ground_level = res.data.data.ground_level;
            var min_bank = res.data.data.min_bank;
            let status_water = null;

            var html = '';
            for (let count_data = 0; count_data < data_water.length; count_data++) {

                //ดึงเวลา
                if (data_water[count_data]["value"] != null) {

                    var get_time = new Date(data_water[count_data]["datetime"]);
                    var time = get_time.getHours() + ":" + ("0" + get_time.getMinutes()).slice(-2);
                    //ดีงปริมาณน้ำ และคำนวณ
                    var value_water = Number((data_water[count_data]["value"] - ground_level).toFixed(2));
                    //คำนวณ ความสูงตลิ่ง
                    var height_river = Number((min_bank - ground_level).toFixed(2));
                    //คำนวณ ปริมาณน้ำเป็น %
                    var precent_water = ((value_water / height_river) * 100);

                    //สถานการณ์น้ำ
                    if (precent_water <= 29) {
                        status_water = '<span style="width: 7rem;" class="tag is-info is-medium">ปริมาณน้ำน้อย</span>';
                        //console.log(status_water);
                    } else if (precent_water >= 30 && precent_water < 60) {
                        status_water = '<span style="width: 7rem;" class="tag is-success is-medium">ปริมาณน้าปกติ</span>';
                        //console.log(status_water);
                    } else if (precent_water >= 60 && precent_water < 80) {
                        status_water = '<span style="width: 7rem;" class="tag is-Link is-medium">ปริมาณน้ำมาก</span>';
                        //console.log(status_water);
                    } else if (precent_water >= 80 && precent_water < 100) {
                        status_water = '<span style="width: 7rem;" class="tag is-Warning is-medium">น้ำใกล้ล้นตลิ่ง</span>';
                        //console.log(status_water);
                    } else if (precent_water >= 100) {
                        status_water = '<span style="width: 7rem;" class="tag is-danger is-medium">น้ำล้นตลิ่ง</span>';
                        //console.log(status_water);
                    }

                    html += '</tr>'
                    html += '<th>' + time + 'น.</th>';
                    html += '<td>' + value_water + ' เมตร</td>';
                    html += '<td>' + status_water + '</td>';
                    html += '</tr>';
                }

            }

            Swal.fire({
                title: '<p style="font-size: 25px">ข้อมูลสถานี ' + api[id]["station_name"] + ' วันที่ ' + date_show + '</p><p style="font-size: 20px">(ความสูงของตลิ่ง : ' + height_river + ' เมตร)' + '</p>',
                width: 800,
                html:
                    '<div class="table-container">' +
                    '<table class="table table-hover2" style="width: 740px;">' +
                    '<thead>' +
                    '<th style="width: 8rem;">ข้อมูล ณ เวลา</th>' +
                    '<th style="width: 8rem;">ระดับน้ำ</th>' +
                    '<th style="width: 10rem;">สถานการณ์น้ำ</th>' +
                    '</thead>' +
                    '<tbody>' +
                    html +
                    '</tbody>' +
                    '</table>' +
                    '</div>',
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: false,
                focusConfirm: false
            })
        }
        )
    }

    if (api[id]["type"] === 'min') {

        axios.get("https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_graph?station_type=tele_waterlevel&station_id=" + api[id]["station_id"] + "&start_date=" + date_now + '&end_date=' + date_now + ' ' + hour_now
        ).then(res => {
            var data_water = res.data.data.graph_data;
            var ground_level = res.data.data.ground_level;
            var min_bank = res.data.data.min_bank;
            let status_water = null;

            var html = '';
            for (let count_data = 0; count_data < data_water.length; count_data++) {

                //ดึงเวลา
                if (data_water[count_data]["value"] != null) {
                    var get_time = new Date(data_water[count_data]["datetime"]);
                    if (get_time.getHours() > three_hour) {

                        var time = get_time.getHours() + ":" + ("0" + get_time.getMinutes()).slice(-2);
                        //ดีงปริมาณน้ำ และคำนวณ
                        var value_water = Number((data_water[count_data]["value"] - ground_level).toFixed(2));
                        //คำนวณ ความสูงตลิ่ง
                        var height_river = Number((min_bank - ground_level).toFixed(2));
                        //คำนวณ ปริมาณน้ำเป็น %
                        var precent_water = ((value_water / height_river) * 100);

                        //สถานการณ์น้ำ
                        if (precent_water <= 29) {
                            status_water = '<span style="width: 7rem;" class="tag is-info is-medium">ปริมาณน้ำน้อย</span>';
                            //console.log(status_water);
                        } else if (precent_water >= 30 && precent_water < 60) {
                            status_water = '<span style="width: 7rem;" class="tag is-success is-medium">ปริมาณน้าปกติ</span>';
                            //console.log(status_water);
                        } else if (precent_water >= 60 && precent_water < 80) {
                            status_water = '<span style="width: 7rem;" class="tag is-Link is-medium">ปริมาณน้ำมาก</span>';
                            //console.log(status_water);
                        } else if (precent_water >= 80 && precent_water < 100) {
                            status_water = '<span style="width: 7rem;" class="tag is-Warning is-medium">น้ำใกล้ล้นตลิ่ง</span>';
                            //console.log(status_water);
                        } else if (precent_water >= 100) {
                            status_water = '<span style="width: 7rem;" class="tag is-danger is-medium">น้ำล้นตลิ่ง</span>';
                            //console.log(status_water);
                        }

                        html += '</tr>'
                        html += '<th>' + time + 'น.</th>';
                        html += '<td>' + value_water + ' เมตร</td>';
                        html += '<td>' + status_water + '</td>';
                        html += '</tr>';
                    }
                }

            }

            Swal.fire({
                title: '<p style="font-size: 20px">ข้อมูลสถานี ' + api[id]["station_name"] + ' (ย้อนหลัง 2ชั่วโมง)</p><p style="font-size: 18px">(ความสูงของตลิ่ง : ' + height_river + ' เมตร)' + '</p>',
                width: 700,
                html:
                    '<div class="table-container">' +
                    '<table class="table table-hover2" style="width: 640px;">' +
                    '<thead>' +
                    '<th style="width: 8rem;">ข้อมูล ณ เวลา</th>' +
                    '<th style="width: 8rem;">ระดับน้ำ</th>' +
                    '<th style="width: 10rem;">สถานการณ์น้ำ</th>' +
                    '</thead>' +
                    '<tbody>' +
                    html +
                    '</tbody>' +
                    '</table>' +
                    '</div>',
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: false,
                focusConfirm: false
            })
        }
        )
    }
}

function map() {
    const dates = new Date();
    let date_now = dates.getFullYear() + "-" + (dates.getMonth() + 1) + '-' + dates.getDate();
    let hour_now = dates.getHours() + ":" + dates.getMinutes();

    var map = L.map('map').setView([17.306372836907798, 99.82979728496773], 9.2);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //console.log(data_public)
    for (let i in api) {

        axios.get("https://api-v3.thaiwater.net/api/v1/thaiwater30/public/waterlevel_graph?station_type=tele_waterlevel&station_id=" + api[i]["station_id"] + "&start_date=" + date_now + '&end_date=' + date_now + ' ' + hour_now
        ).then(res => {
            var data_water = res.data.data.graph_data;
            var ground_level = res.data.data.ground_level;
            var min_bank = res.data.data.min_bank;
            let status_water = null;

            let count_data = data_water.length;
            for (count_data > data_water.length; --count_data;) {

                //ดึงเวลา
                if (data_water[count_data]["value"] != null) {

                    //ดีงปริมาณน้ำ และคำนวณ
                    var value_water = Number((data_water[count_data]["value"] - ground_level).toFixed(2));
                    //คำนวณ ความสูงตลิ่ง
                    var height_river = Number((min_bank - ground_level).toFixed(2));
                    //คำนวณ ปริมาณน้ำเป็น %
                    var precent_water = ((value_water / height_river) * 100);

                    //สถานการณ์น้ำ
                    if (precent_water <= 29) {
                        var icon = L.icon({
                            iconUrl: '/img/marker/location_info.png',
                            iconSize: [32, 32], // size of the icon
                        });

                        marker[i] = L.marker([api[i]["station_lat"], api[i]["station_lon"]], { icon: icon }).addTo(map);

                        marker[i].addEventListener("click", e => {

                            more_data_icon(i);
                        });
                    } else if (precent_water >= 30 && precent_water < 60) {
                        var icon = L.icon({
                            iconUrl: '/img/marker/location_green.png',
                            iconSize: [32, 32], // size of the icon
                        });

                        marker[i] = L.marker([api[i]["station_lat"], api[i]["station_lon"]], { icon: icon }).addTo(map);

                        marker[i].addEventListener("click", e => {

                            more_data_icon(i);
                        });
                    } else if (precent_water >= 60 && precent_water < 80) {
                        var icon = L.icon({
                            iconUrl: '/img/marker/location_link.png',
                            iconSize: [32, 32], // size of the icon
                        });

                        marker[i] = L.marker([api[i]["station_lat"], api[i]["station_lon"]], { icon: icon }).addTo(map);

                        marker[i].addEventListener("click", e => {

                            more_data_icon(i);
                        });
                    } else if (precent_water >= 80 && precent_water < 100) {
                        var icon = L.icon({
                            iconUrl: '/img/marker/location_warning.png',
                            iconSize: [32, 32], // size of the icon
                        });

                        marker[i] = L.marker([api[i]["station_lat"], api[i]["station_lon"]], { icon: icon }).addTo(map);

                        marker[i].addEventListener("click", e => {

                            more_data_icon(i);
                        });
                    } else if (precent_water >= 100) {
                        var icon = L.icon({
                            iconUrl: '/img/marker/location_danger.png',
                            iconSize: [32, 32], // size of the icon
                        });

                        marker[i] = L.marker([api[i]["station_lat"], api[i]["station_lon"]], { icon: icon }).addTo(map);

                        marker[i].addEventListener("click", e => {

                            more_data_icon(i);
                        });
                    }

                    break;
                }

            }

        }
        )
    }

}
map()
