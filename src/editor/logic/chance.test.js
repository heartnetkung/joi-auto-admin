import { randomData, genChanceString } from "./chance";

describe("randomData()", () => {
	it("basic case", () => {
		var editors = [
			{ name: "a", fieldType: "common|number" },
			{ name: "b", fieldType: "format|url" },
			{ name: "c", fieldType: "format|thai tel" },
			{ name: "d", fieldType: "format|email" },
			{ name: "e", fieldType: "checkbox" },
			{ name: "f", fieldType: "common|date" },
			{ name: "g", fieldType: "common|barcode scanner" },
			{ name: "h", fieldType: "dropdown" },
			{ name: "i.j", fieldType: "input" },
		];
		var output = [
			{
				a: 17,
				b:
					"https://www.gravatar.com/avatar/603c935591dbf0e30095297308f9c160",
				c: "0812345678",
				d: "rinovka@luzav.tg",
				e: false,
				f: new Date("2101-06-25T04:31:46.678Z"),
				g: ['a001'],
				h: "f",
				i: { j: "fizrak" },
			},
		];
		var ans = randomData(editors, 1);
		expect(ans).toEqual(output);
	});
});

describe("genChanceString()", () => {
	it("basic case", () => {
		var editors = [
			{ name: "a", fieldType: "common|number" },
			{ name: "b", fieldType: "format|url" },
			{ name: "c", fieldType: "format|thai tel" },
			{ name: "d", fieldType: "format|email" },
			{ name: "e", fieldType: "checkbox" },
			{ name: "f", fieldType: "common|date" },
			{ name: "g", fieldType: "common|barcode scanner" },
			{ name: "h", fieldType: "dropdown" },
			{ name: "i.j", fieldType: "input" },
		];
		var output = `()=>{const ans=[]; for(let i=0;i<5;i++)ans.push({"a":chance.natural({ max:30 }),"b":chance.avatar({ protocol:"https" }),"c":chance.pickone([ "0812345678",
    "021111111" ]),"d":chance.email(),"e":chance.bool(),"f":chance.date(),"g":chance.pickone([ [ "a001" ],
    [ "a002" ] ]),"h":chance.pickone([ "m",
    "f" ]),"i":{"j":chance.word()}}); return ans;}`;
		expect(genChanceString(editors, 5)).toEqual(output);
	});
});
