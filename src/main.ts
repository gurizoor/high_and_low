
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;



const points = document.getElementById("points") as HTMLSpanElement;  points.innerHTML = "1000";
const bet = document.getElementById("bet_input") as HTMLInputElement;
const bet_div = document.getElementById("bet_div") as HTMLLabelElement;
const bet_button = document.getElementById("bet_button") as HTMLButtonElement;

const high_low_div = document.getElementById("high_low_div") as HTMLDivElement;
const high = document.getElementById("high") as HTMLButtonElement;
const low = document.getElementById("low") as HTMLButtonElement;



function random_number(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function random_cards(){
    return random_number(1, 13);
}

let current_card = random_cards();
let next_card = random_cards();

const card_info = [100, 25, 150, 250, 25]  //{x:0, y:0, width:150, height:250, radius:25};

function draw_cards(card_info: number[])
{
    const card_info_inside = [card_info[0] + 10, card_info[1] + 10, card_info[2] - 20, card_info[3] - 20, card_info[4]];
    drawRoundedRect(context, card_info[0], card_info[1], card_info[2], card_info[3], card_info[4], "black");
    drawRoundedRect(context, card_info_inside[0], card_info_inside[1], card_info_inside[2], card_info_inside[3], card_info_inside[4], "white");
    draw_text(context, String(current_card), card_info[0]+50, card_info[1]+150, 100, true);
}

function draw_cards_hidden(card_info: number[])
{
    const card_info_inside = [card_info[0] + 10, card_info[1] + 10, card_info[2] - 20, card_info[3] - 20, card_info[4]];
    drawRoundedRect(context, card_info[0], card_info[1], card_info[2], card_info[3], card_info[4], "black");
    drawRoundedRect(context, card_info_inside[0], card_info_inside[1], card_info_inside[2], card_info_inside[3], card_info_inside[4], "white");
    // draw_text(context, String(current_card), card_info[0]+50, card_info[1]+150, 100, true);
}

// draw_cards(card_info);
draw_cards_hidden(card_info);

function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    width: number, height: number,
    radius: number, fillStyle: string | CanvasGradient | CanvasPattern = "black"
){
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius); 
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill(); 
}

function draw_text(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number = 48, fixed: boolean = false) {
    let font_size = String(size) + "px serif";
    ctx.font = font_size;
    if(text.length > 1 && fixed){x = x-25;}
    ctx.strokeText(text, x, y);
}



bet_button.addEventListener("click", () => {
    betting();
});

high.addEventListener("click", () => {
    high_low_judge("high");
});

low.addEventListener("click", () => {
    high_low_judge("low");
});



let number_of_timer = 0;
function notify(text: string){
    const notice = document.getElementById("notice")
    if(notice == null){console.error("notice is null");return;}
    notice.innerHTML = text;
    window.clearTimeout(number_of_timer);
    number_of_timer = window.setTimeout(reset_notice, 5000);
}

function reset_notice(){
    const notice = document.getElementById("notice")
    if(notice == null){console.error("notice is null");return;}
    notice.innerHTML = "";
}

high_low_div.style.display = "none";
function change_mode(){
    if(high_low_div.style.display == "none"){
        high_low_div.style.display = "block";
        bet_div.style.display = "none";
        draw_cards(card_info);
    }else{
        bet_div.style.display = "block";
        high_low_div.style.display = "none";
        draw_cards_hidden(card_info);
    }
}

let bet_point: number;
function get_points(){
    return parseInt(points.innerHTML);
}
function set_points(point: number){
    points.innerHTML = String(point);
}
function add_points(point: number){
    set_points(get_points() + point);
}
function minus_points(point: number){
    set_points(get_points() - point);
}

function betting(){
    if(parseInt(points.innerHTML) < parseInt(bet.value)){
        notify("ポイントが不足しています");
        return;
    }
    if(parseInt(bet.value) <= 0 || bet.value == ""){
        notify("0より大きい数を入力してください");
        return;
    }
    bet_point = parseInt(bet.value);
    minus_points(bet_point);
    // points.innerHTML = String(parseInt(points.innerHTML) - bet_point);
    change_mode();
}

function high_low_judge(high_low: string){
    let is_correct = high_low == high_or_low();
    let judge;
    if(is_correct){
        judge = "correct";
    }else if("draw" == high_or_low()){
        judge = "draw";
    }else{
        judge = "wrong";
    }
    switch (judge){
        case "correct":
            const reward = bet_point * 2.0;
            add_points(reward);
            notify("Correct!"+reward+"ポイントゲットしました");
            break;

        case "draw":
            add_points(bet_point);
            notify("draw!ベットしたポイントは返却されます");
            break;

        case "wrong":
            notify("Wrong!"+bet_point+"ポイント失いしました");
            break;
    }
    current_card = random_cards();
    next_card = random_cards();
    change_mode();
}

function high_or_low(){
    if(current_card < next_card){
        return "high";
    }else if(next_card < current_card){
        return "low";
    }else{
        return "draw";
    }
}
