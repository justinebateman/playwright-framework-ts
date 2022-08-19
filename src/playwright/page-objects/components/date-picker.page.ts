import { Locator, Page } from "@playwright/test";
import moment from "moment";
import generalHelper from "../../util/general-helpers";
import IPage from "../IPage";
import { elementHelpers } from "../../util";

export default class DatePickerPage implements IPage {
  readonly page: Page;

  readonly url: string = "";

  private readonly datePickerContainer: Locator;

  private readonly selectedMonth: Locator;

  private readonly selectedYear: Locator;

  private readonly selectedDay: Locator;

  private readonly previousMonthButton: Locator;

  private readonly previousYearButton: Locator;

  private readonly nextMonthButton: Locator;

  private readonly nextYearButton: Locator;

  private readonly dayButton = (day: string): Locator => {
    return this.datePickerContainer.locator(
      `td.ant-picker-cell-in-view div.ant-picker-cell-inner:text-is('${day}')`
    );
  };

  private readonly todayButton: Locator;

  public constructor(page: Page) {
    this.page = page;

    this.datePickerContainer = this.page.locator(
      "div.ant-picker-dropdown:visible"
    );
    this.selectedMonth = this.datePickerContainer.locator(
      "button.ant-picker-month-btn"
    );
    this.selectedYear = this.datePickerContainer.locator(
      "button.ant-picker-year-btn"
    );
    this.selectedDay = this.datePickerContainer.locator(
      "td.ant-picker-cell-selected"
    );
    this.previousMonthButton = this.datePickerContainer.locator(
      "span.ant-picker-prev-icon"
    );
    this.previousYearButton = this.datePickerContainer.locator(
      "span.ant-picker-super-prev-icon"
    );
    this.nextMonthButton = this.datePickerContainer.locator(
      "span.ant-picker-next-icon"
    );
    this.nextYearButton = this.datePickerContainer.locator(
      "span.ant-picker-super-next-icon"
    );
    this.todayButton = this.datePickerContainer.locator(
      "a.ant-picker-today-btn"
    );
  }

  async getCurrentlySelectedYear(): Promise<string> {
    return (await this.selectedYear.textContent()) || "";
  }

  async getCurrentlySelectedMonth(): Promise<string> {
    return (await this.selectedMonth.textContent()) || "";
  }

  async selectYear(year: string): Promise<void> {
    const yearNumber = Number(year);

    if (year !== (await this.getCurrentlySelectedYear())) {
      if (yearNumber > new Date().getFullYear()) {
        while (year !== (await this.getCurrentlySelectedYear())) {
          await this.nextYearButton.click();
        }
      } else if (yearNumber < new Date().getFullYear()) {
        while (year !== (await this.getCurrentlySelectedYear())) {
          await this.previousYearButton.click();
        }
      }
    }
  }

  async selectMonth(month: string): Promise<void> {
    const monthNumber = Number(moment().month(month).format("M"));
    if (month !== (await this.getCurrentlySelectedMonth())) {
      if (monthNumber > new Date().getMonth()) {
        while (month !== (await this.getCurrentlySelectedMonth())) {
          await this.nextMonthButton.click();
        }
      } else if (monthNumber < new Date().getMonth()) {
        while (month !== (await this.getCurrentlySelectedMonth())) {
          await this.previousMonthButton.click();
        }
      }
    }
  }

  async selectDay(day: string): Promise<void> {
    await this.dayButton(day).click();
  }

  // must be provided in the format YYYY-MM-DD
  async selectFullDate(date: string): Promise<void> {
    const formattedDate = generalHelper.convertDateStringToCorrectFormat(date);
    const actualDate = new Date(formattedDate);
    await elementHelpers.waitForElementToBeVisible(this.datePickerContainer);
    const year = actualDate.getFullYear().toString();
    const month = actualDate.toLocaleString("default", { month: "short" });
    const day = actualDate.getDate().toString();
    await this.selectYear(year);
    await this.selectMonth(month);
    await this.selectDay(day);
  }
}
