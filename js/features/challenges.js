const CHALS = [
    {
        unl: ()=>true,

        max: 20,
        id: 'pp',

        title: `Меньше уровней`,
        desc: `Требования к уровню повышены.`,
        reward: `Получение ОО увеличено на <b class="green">100%</b> за каждое выполнение.`,

        goal: i=>30+10*i,
        bulk: i=>Math.floor((i-30)/10+1),

        goalDesc: x=>"Уровень "+format(x,0),
        goalAmt: ()=>player.level.toNumber(),

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x)+"x",
    },{
        unl: ()=>true,

        max: 20,
        id: 'pp',

        title: `Безтравный`,
        desc: `Травные улучшения нельзя покупать.`,
        reward: `Получение Травы увеличено на <b class="green">100%</b> за каждое выполнение.`,

        goal: i=>100+10*i,
        bulk: i=>Math.floor((i-100)/10+1),

        goalDesc: x=>"Уровень "+format(x,0),
        goalAmt: ()=>player.level.toNumber(),

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x)+"x",
    },{
        unl: ()=>true,

        max: 20,
        id: 'crystal',

        title: `Без Тиров`,
        desc: `Ты не можешь получать тиры.`,
        reward: `Получение ОТ увеличено на <b class="green">100%</b> за каждое выполнение.`,

        goal: i=>100+10*i,
        bulk: i=>Math.floor((i-100)/10+1),

        goalDesc: x=>"Уровень "+format(x,0),
        goalAmt: ()=>player.level.toNumber(),

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x)+"x",
    },{
        unl: ()=>true,

        max: 10,
        id: 'crystal',

        title: `Уменьшение ресурсов`,
        desc: `Квадратный корень (^0.5) к получению Травы, ОО и ОП.`,
        reward: `Экспонента для множителя Травы увеличен на <b class="green">+2%</b> за каждое выполнение.`,

        goal: i=>50+20*i,
        bulk: i=>Math.floor((i-50)/20+1),

        goalDesc: x=>"Уровень "+format(x,0),
        goalAmt: ()=>player.level.toNumber(),

        eff: i=>i/50+1,
        effDesc: x=>formatPow(x),
    },{
        unl: ()=>true,

        max: 10,
        id: 'crystal',

        title: `Безпрестижный`,
        desc: `Престижные улучшения нельзя покупать.`,
        reward: `Получение ОП увеличено на <b class="green">100%</b> за каждое выполнение.`,

        goal: i=>7+i,
        bulk: i=>i-6,

        goalDesc: x=>"Тир "+format(x,0),
        goalAmt: ()=>player.tier.toNumber(),

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x)+"x",
    },{
        unl: ()=>player.sTimes > 0,

        max: 10,
        id: 'steel',

        title: `Уменьшение ресурсов II`,
        desc: `Квадратный корень (^0.5) к получению травы, ОО, ОП, ОТ и кристаллов.`,
        reward: `Получение Стали увеличено на <b class="green">50%</b> за каждое выполнение.`,

        goal: i=>100+i*20,
        bulk: i=>Math.floor((i-100)/20+1),

        goalDesc: x=>"Уровень "+format(x,0),
        goalAmt: ()=>player.level.toNumber(),

        eff: i=>Decimal.pow(1.5,i),
        effDesc: x=>format(x)+"x",
    },{
        unl: ()=>player.sTimes > 0,

        max: 10,
        id: 'steel',

        title: `Без кристаллов`,
        desc: `Кристальные улучшения нельзя купить.`,
        reward: `Получение Кристаллов увеличено на <b class="green">100%</b> за каждое выполнение.`,

        goal: i=>20+i,
        bulk: i=>i-19,

        goalDesc: x=>"Тир "+format(x,0),
        goalAmt: ()=>player.tier.toNumber(),

        eff: i=>Decimal.pow(2,i),
        effDesc: x=>format(x)+"x",
    },{
        unl: ()=>hasUpgrade('factory',2),

        max: 10,
        id: 'steel',

        title: `Вызовлизм`,
        desc: `Ты застрял во Вызовах Престижа и Кристаллов, кроме Уменьшение Ресурсов.`,
        reward: `Зарядка происходит в <b class="green">10x</b> быстрее за каждое выполнение.`,

        goal: i=>40+i*10,
        bulk: i=>Math.floor((i-40)/10+1),

        goalDesc: x=>"Уровень "+format(x,0),
        goalAmt: ()=>player.level.toNumber(),

        eff: i=>Decimal.pow(10,i),
        effDesc: x=>format(x)+"x",
    },
]

const chalSGoal = (()=>{
    let x = []
    for (let i in CHALS) x.push(CHALS[i].goal(0))
    return x
})()

function inChal(x) {
    let p = player.chal.progress
    return p == x
}

function enterChal(x) {
    if (player.chal.progress != x) {
        if (x == -1) RESET[CHALS[player.chal.progress].id].reset(true)

        player.chal.progress = x

        if (x > -1) RESET[CHALS[x].id].reset(true)
    } else enterChal(-1)
}

function chalEff(x,def=E(1)) { return tmp.chal.eff[x] || def }

tmp_update.push(()=>{
    for (let i in CHALS) {
        let c = player.chal.comp[i]||0
        tmp.chal.goal[i] = CHALS[i].goal(c)
        tmp.chal.eff[i] = CHALS[i].eff(c)
    }
    if (!inChal(-1)) {
        let p = player.chal.progress
        let c = CHALS[p]
        let a = c.goalAmt()
        tmp.chal.amt = a
        tmp.chal.bulk = a >= chalSGoal[p] ? Math.min(c.bulk(a),c.max) : 0
    }
})

el.setup.chal = ()=>{
    let table = new Element('chal_table')
    let html = ``

    for (let i in CHALS) {
        let c = CHALS[i]

        html += `
        <div class="chal_div ${c.id}" id="chal_div_${i}" onclick="enterChal(${i})">
            <h3>${c.title}</h3><br>
            <b class="yellow" id="chal_comp_${i}">0 / 0</b><br><br>
            ${c.desc}<br>
            Награда: ${c.reward}<br>
            Эффект: <b class="cyan" id="chal_eff_${i}">???</b>

            <div style="position:absolute; bottom:7px; width:100%;">
                Статус: <b class="red" id="chal_pro_${i}">Неактивен</b><br>
                <b class="red" id="chal_goal_${i}">Цель: ???</b>
            </div>
        </div>
        `
    }

    table.setHTML(html)
}

el.update.chal = ()=>{
    if (mapID == 'chal') {
        let unl = !tmp.outsideNormal

        tmp.el.chal_unl.setDisplay(unl && player.cTimes == 0)
        tmp.el.chal_div.setDisplay(unl && player.cTimes > 0)

        if (unl) {
            for (let i in CHALS) {
                let c = CHALS[i]

                let unl2 = c.unl()

                tmp.el['chal_div_'+i].setDisplay(unl2)

                if (unl2) {
                    let l = player.chal.comp[i]||0
                    let completed = l >= c.max
                    let a = inChal(-1) ? 0 : tmp.chal.amt

                    tmp.el["chal_comp_"+i].setTxt(format(l,0) + " / " + format(c.max,0))
                    tmp.el["chal_eff_"+i].setHTML(c.effDesc(tmp.chal.eff[i]))
                    tmp.el["chal_pro_"+i].setTxt(completed ? "Выполнено" : inChal(i) ? "В процессе" : "Неактивен")
                    tmp.el["chal_pro_"+i].setClasses({[completed ? "green" : inChal(i) ? "yellow" : "red"]: true})

                    tmp.el["chal_goal_"+i].setTxt("Goal: "+c.goalDesc(tmp.chal.goal[i]))
                    tmp.el["chal_goal_"+i].setClasses({[inChal(i) && a >= tmp.chal.goal[i] ? "green" : "red"]: true})
                }
            }
        }
    }
}
