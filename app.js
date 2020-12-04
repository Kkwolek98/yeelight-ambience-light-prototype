const Vibrant = require('node-vibrant')
const screenshot = require('screenshot-desktop')
const Lookup = require("node-yeelight-wifi").Lookup;

const lookup = new Lookup();

lookup.on("detected", (bulb) => {
    bulb.setPower(true).then(() => {
        console.log(`Connected bulb id ${bulb.id}`)
    }).catch(error => {
        console.error(error)
    });
    let prevColor;
    setInterval(async () => {
        let screenshot  = await takeScreenshot();
        let color = await getColor(screenshot);
        try {
            console.log({prevColor})
            if(!prevColor || !prevColor.every((val, index) => val === color[index])) {
                bulb.setRGB(color).then(() => {
                    console.log(`Set color ${color} on ${bulb.id}`);
                    prevColor = color;
                }).catch(error => {
                    console.error(error);
                });
            }
        } catch(error) {
            console.error(error)
        }
    }, 1000);
})

async function takeScreenshot() {
    return await screenshot.listDisplays().then(async displays => {
        return await screenshot({ screen: displays[displays.length - 1].id }).then(img => img)
    });
}

async function getColor(img) {
    return await Vibrant.from(img).getPalette().then(palette => palette.Vibrant.rgb);
}