
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;



const points = document.getElementById("points") as HTMLSpanElement;  points.innerHTML = "1000";
const bet = document.getElementById("bet_input") as HTMLInputElement;

const High = document.getElementById("High") as HTMLButtonElement;
const Low = document.getElementById("Low") as HTMLButtonElement;



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

draw_cards(card_info);

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



High.addEventListener("click", () => {
    betting(true);
});

Low.addEventListener("click", () => {
    betting(false);
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

function betting(is_high: boolean){//is_high => true:high, false:low
    if(parseInt(points.innerHTML) < parseInt(bet.value)){notify("ポイントが不足しています");return;}
    let is_bet = !(bet.value == "")
    let is_crrect = is_high == high_or_low()
    if(is_bet){
        console.log("betted")
        if(is_crrect){
            let magnify = 1.5;
            let reward = parseInt(bet.value)*magnify;
            points.innerHTML = String(parseInt(points.innerHTML) + reward);
            notify("Correct! "+String(reward)+"ポイントゲットしました");
        }else{
            points.innerHTML = String(parseInt(points.innerHTML) - parseInt(bet.value));
            notify("Wrong!"+String(bet.value)+"ポイント失いしました");
        }
    }else{
        console.log("is not betted")
        if(is_crrect){
            const reward = 50;
            points.innerHTML = String(parseInt(points.innerHTML) + reward);
            notify("Correct!"+reward+"ポイントゲットしました");
        }else{
            notify("Wrong!");
        }
    }

    current_card = next_card;
    next_card = random_cards();
    draw_cards(card_info);
}

function high_or_low(){
    if(current_card < next_card){
        return true;
    }else{
        return false;
    }
}
