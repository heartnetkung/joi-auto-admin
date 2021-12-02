jest.mock("../../lib/shared/xlsx");

import { render, fireEvent, screen } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop1 } from "../mock";
import React from "react";
import { tableToExcel } from "../../lib/shared/xlsx";

it("basic download excel", async () => {
	render(<AutoAdmin {...prop1} />);
	var menu = await screen.findByText(/เมนูอื่นๆ/);
	fireEvent.mouseEnter(menu);
	var download = await screen.findByText(/ดาวน์โหลด Excel/);
	fireEvent.click(download);

	expect(tableToExcel.mock.calls.length).toBe(1);
	expect(tableToExcel.mock.calls[0][0]).toEqual([{ fooName: "bar" }]);
	expect(tableToExcel.mock.calls[0][1]).toEqual("export.xlsx");
	expect(console.error.mock.calls.length).toBe(0);
});

it("disableExcelDownload", async () => {
	render(<AutoAdmin {...prop1} disableExcelDownload />);
	var menu = await screen.findByText(/dataName/);
	expect(screen.queryByText(/เมนูอื่นๆ/)).toBe(null);
	expect(console.error.mock.calls.length).toBe(0);
});

it("no other_menu", async () => {
	var getMany = () => [];
	render(<AutoAdmin {...prop1} getMany={getMany} />);
	var menu = await screen.findByText(/dataName/);
	expect(screen.queryByText(/เมนูอื่นๆ/)).toBe(null);
	expect(console.error.mock.calls.length).toBe(0);
});

it("basic upload excel", async () => {
	const createMany = jest.fn();
	render(<AutoAdmin {...prop1} createMany={createMany} />);
	var menu = await screen.findByText(/เมนูอื่นๆ/);
	fireEvent.mouseEnter(menu);
	await screen.findByText(/อัพโหลด Excel/);
	await screen.findByText(/ตัวอย่าง Excel อัพโหลด/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("empty case upload excel", async () => {
	var createMany = () => {};
	var getMany = () => [];
	render(<AutoAdmin {...prop1} createMany={createMany} getMany={getMany} />);
	var menu = await screen.findByText(/เมนูอื่นๆ/);
	fireEvent.mouseEnter(menu);
	await screen.findByText(/อัพโหลด Excel/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("empty case with  upload excel", async () => {
	var createMany = () => {};
	var getMany = () => [];
	render(
		<AutoAdmin
			{...prop1}
			createMany={createMany}
			getMany={getMany}
			uploadPreviewUrl="abc"
		/>
	);
	var menu = await screen.findByText(/เมนูอื่นๆ/);
	fireEvent.mouseEnter(menu);
	await screen.findByText(/อัพโหลด Excel/);
	await screen.findByText(/ตัวอย่าง Excel อัพโหลด/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("disableExcelUpload", async () => {
	var createMany = () => {};
	render(<AutoAdmin {...prop1} disableExcelUpload createMany={createMany} />);
	var menu = await screen.findByText(/เมนูอื่นๆ/);
	fireEvent.mouseEnter(menu);
	await screen.findByText(/ดาวน์โหลด Excel/);
	expect(screen.queryByText(/อัพโหลด Excel/)).toBe(null);
	expect(screen.queryByText(/ตัวอย่าง Excel อัพโหลด/)).toBe(null);
	expect(console.error.mock.calls.length).toBe(0);
});
