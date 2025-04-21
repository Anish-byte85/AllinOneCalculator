"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftRight } from "lucide-react"

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [result, setResult] = useState<number | null>(null)
  const [searchFrom, setSearchFrom] = useState("")
  const [searchTo, setSearchTo] = useState("")

  // Exchange rates relative to USD (1 USD = X units of currency)
  const exchangeRates: Record<string, number> = {
    USD: 1, // United States Dollar
    EUR: 0.92, // Euro
    GBP: 0.79, // British Pound
    JPY: 151.72, // Japanese Yen
    AUD: 1.52, // Australian Dollar
    CAD: 1.37, // Canadian Dollar
    CHF: 0.91, // Swiss Franc
    CNY: 7.24, // Chinese Yuan
    HKD: 7.81, // Hong Kong Dollar
    NZD: 1.65, // New Zealand Dollar
    SEK: 10.52, // Swedish Krona
    KRW: 1358.63, // South Korean Won
    SGD: 1.35, // Singapore Dollar
    NOK: 10.72, // Norwegian Krone
    MXN: 16.76, // Mexican Peso
    INR: 83.47, // Indian Rupee
    RUB: 92.26, // Russian Ruble
    ZAR: 18.41, // South African Rand
    TRY: 32.15, // Turkish Lira
    BRL: 5.07, // Brazilian Real
    TWD: 32.27, // Taiwan Dollar
    DKK: 6.87, // Danish Krone
    PLN: 3.94, // Polish Zloty
    THB: 36.31, // Thai Baht
    IDR: 15747.5, // Indonesian Rupiah
    HUF: 356.68, // Hungarian Forint
    CZK: 23.16, // Czech Koruna
    ILS: 3.67, // Israeli Shekel
    CLP: 926.3, // Chilean Peso
    PHP: 56.83, // Philippine Peso
    AED: 3.67, // UAE Dirham
    COP: 3881.85, // Colombian Peso
    SAR: 3.75, // Saudi Riyal
    MYR: 4.71, // Malaysian Ringgit
    RON: 4.58, // Romanian Leu
    ARS: 873.5, // Argentine Peso
    PKR: 278.5, // Pakistani Rupee
    QAR: 3.64, // Qatari Riyal
    KWD: 0.31, // Kuwaiti Dinar
    NGN: 1450.0, // Nigerian Naira
    EGP: 47.85, // Egyptian Pound
    VND: 25150.0, // Vietnamese Dong
    BGN: 1.8, // Bulgarian Lev
    HRK: 6.95, // Croatian Kuna
    UAH: 39.85, // Ukrainian Hryvnia
    DZD: 134.5, // Algerian Dinar
    PEN: 3.7, // Peruvian Sol
    MAD: 9.95, // Moroccan Dirham
    BHD: 0.38, // Bahraini Dinar
    OMR: 0.38, // Omani Rial
    JOD: 0.71, // Jordanian Dinar
    KZT: 447.5, // Kazakhstani Tenge
    LKR: 309.5, // Sri Lankan Rupee
    BDT: 109.5, // Bangladeshi Taka
    ISK: 138.5, // Icelandic Króna
    KES: 129.5, // Kenyan Shilling
    BAM: 1.8, // Bosnia-Herzegovina Convertible Mark
    TND: 3.12, // Tunisian Dinar
    GHS: 14.5, // Ghanaian Cedi
    UGX: 3750.0, // Ugandan Shilling
    UYU: 38.75, // Uruguayan Peso
    RSD: 108.0, // Serbian Dinar
    ALL: 95.5, // Albanian Lek
    BYN: 3.25, // Belarusian Ruble
    AZN: 1.7, // Azerbaijani Manat
    BOB: 6.91, // Bolivian Boliviano
    CRC: 518.5, // Costa Rican Colón
    DOP: 58.5, // Dominican Peso
    GEL: 2.65, // Georgian Lari
    GTQ: 7.8, // Guatemalan Quetzal
    HNL: 24.7, // Honduran Lempira
    JMD: 156.5, // Jamaican Dollar
    MKD: 56.75, // Macedonian Denar
    MDL: 17.75, // Moldovan Leu
    NAD: 18.41, // Namibian Dollar
    NIO: 36.75, // Nicaraguan Córdoba
    PYG: 7350.0, // Paraguayan Guarani
    SVC: 8.75, // Salvadoran Colón
    TZS: 2550.0, // Tanzanian Shilling
    TTD: 6.8, // Trinidad and Tobago Dollar
    UZS: 12750.0, // Uzbekistani Som
    VEF: 36.5, // Venezuelan Bolívar
    ZMW: 26.5, // Zambian Kwacha
    BND: 1.35, // Brunei Dollar
    FJD: 2.25, // Fijian Dollar
    XAF: 604.5, // Central African CFA Franc
    XOF: 604.5, // West African CFA Franc
    XPF: 110.0, // CFP Franc
    MUR: 45.5, // Mauritian Rupee
    MVR: 15.4, // Maldivian Rufiyaa
    BBD: 2.0, // Barbadian Dollar
    XCD: 2.7, // East Caribbean Dollar
    AWG: 1.8, // Aruban Florin
    PAB: 1.0, // Panamanian Balboa
    BMD: 1.0, // Bermudian Dollar
    KYD: 0.83, // Cayman Islands Dollar
    NPR: 133.5, // Nepalese Rupee
    MMK: 2100.0, // Myanmar Kyat
    MNT: 3450.0, // Mongolian Tugrik
    LAK: 20750.0, // Laotian Kip
    KHR: 4100.0, // Cambodian Riel
    MOP: 8.05, // Macanese Pataca
    ETB: 56.5, // Ethiopian Birr
    AMD: 387.5, // Armenian Dram
    SYP: 13000.0, // Syrian Pound
    IQD: 1310.0, // Iraqi Dinar
    IRR: 42000.0, // Iranian Rial
    LBP: 90000.0, // Lebanese Pound
    LYD: 4.85, // Libyan Dinar
    SDG: 600.0, // Sudanese Pound
    YER: 250.0, // Yemeni Rial
    AOA: 835.0, // Angolan Kwanza
    RWF: 1275.0, // Rwandan Franc
    BIF: 2850.0, // Burundian Franc
    SLL: 19750.0, // Sierra Leonean Leone
    SOS: 571.5, // Somali Shilling
    ERN: 15.0, // Eritrean Nakfa
    SZL: 18.41, // Swazi Lilangeni
    LSL: 18.41, // Lesotho Loti
    MWK: 1675.0, // Malawian Kwacha
    MZN: 63.75, // Mozambican Metical
    SCR: 13.25, // Seychellois Rupee
    CVE: 101.5, // Cape Verdean Escudo
    GMD: 67.5, // Gambian Dalasi
    GNF: 8650.0, // Guinean Franc
    MGA: 4450.0, // Malagasy Ariary
    STD: 22650.0, // São Tomé and Príncipe Dobra
    BTN: 83.47, // Bhutanese Ngultrum
    WST: 2.75, // Samoan Tala
    TOP: 2.38, // Tongan Paʻanga
    SBD: 8.45, // Solomon Islands Dollar
    VUV: 120.5, // Vanuatu Vatu
    PGK: 3.75, // Papua New Guinean Kina
  }

  // Currency data with names and codes
  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "HKD", name: "Hong Kong Dollar" },
    { code: "NZD", name: "New Zealand Dollar" },
    { code: "SEK", name: "Swedish Krona" },
    { code: "KRW", name: "South Korean Won" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "NOK", name: "Norwegian Krone" },
    { code: "MXN", name: "Mexican Peso" },
    { code: "INR", name: "Indian Rupee" },
    { code: "RUB", name: "Russian Ruble" },
    { code: "ZAR", name: "South African Rand" },
    { code: "TRY", name: "Turkish Lira" },
    { code: "BRL", name: "Brazilian Real" },
    { code: "TWD", name: "Taiwan Dollar" },
    { code: "DKK", name: "Danish Krone" },
    { code: "PLN", name: "Polish Zloty" },
    { code: "THB", name: "Thai Baht" },
    { code: "IDR", name: "Indonesian Rupiah" },
    { code: "HUF", name: "Hungarian Forint" },
    { code: "CZK", name: "Czech Koruna" },
    { code: "ILS", name: "Israeli Shekel" },
    { code: "CLP", name: "Chilean Peso" },
    { code: "PHP", name: "Philippine Peso" },
    { code: "AED", name: "UAE Dirham" },
    { code: "COP", name: "Colombian Peso" },
    { code: "SAR", name: "Saudi Riyal" },
    { code: "MYR", name: "Malaysian Ringgit" },
    { code: "RON", name: "Romanian Leu" },
    { code: "ARS", name: "Argentine Peso" },
    { code: "PKR", name: "Pakistani Rupee" },
    { code: "QAR", name: "Qatari Riyal" },
    { code: "KWD", name: "Kuwaiti Dinar" },
    { code: "NGN", name: "Nigerian Naira" },
    { code: "EGP", name: "Egyptian Pound" },
    { code: "VND", name: "Vietnamese Dong" },
    { code: "BGN", name: "Bulgarian Lev" },
    { code: "HRK", name: "Croatian Kuna" },
    { code: "UAH", name: "Ukrainian Hryvnia" },
    { code: "DZD", name: "Algerian Dinar" },
    { code: "PEN", name: "Peruvian Sol" },
    { code: "MAD", name: "Moroccan Dirham" },
    { code: "BHD", name: "Bahraini Dinar" },
    { code: "OMR", name: "Omani Rial" },
    { code: "JOD", name: "Jordanian Dinar" },
    { code: "KZT", name: "Kazakhstani Tenge" },
    { code: "LKR", name: "Sri Lankan Rupee" },
    { code: "BDT", name: "Bangladeshi Taka" },
    { code: "ISK", name: "Icelandic Króna" },
    { code: "KES", name: "Kenyan Shilling" },
    { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark" },
    { code: "TND", name: "Tunisian Dinar" },
    { code: "GHS", name: "Ghanaian Cedi" },
    { code: "UGX", name: "Ugandan Shilling" },
    { code: "UYU", name: "Uruguayan Peso" },
    { code: "RSD", name: "Serbian Dinar" },
    { code: "ALL", name: "Albanian Lek" },
    { code: "BYN", name: "Belarusian Ruble" },
    { code: "AZN", name: "Azerbaijani Manat" },
    { code: "BOB", name: "Bolivian Boliviano" },
    { code: "CRC", name: "Costa Rican Colón" },
    { code: "DOP", name: "Dominican Peso" },
    { code: "GEL", name: "Georgian Lari" },
    { code: "GTQ", name: "Guatemalan Quetzal" },
    { code: "HNL", name: "Honduran Lempira" },
    { code: "JMD", name: "Jamaican Dollar" },
    { code: "MKD", name: "Macedonian Denar" },
    { code: "MDL", name: "Moldovan Leu" },
    { code: "NAD", name: "Namibian Dollar" },
    { code: "NIO", name: "Nicaraguan Córdoba" },
    { code: "PYG", name: "Paraguayan Guarani" },
    { code: "SVC", name: "Salvadoran Colón" },
    { code: "TZS", name: "Tanzanian Shilling" },
    { code: "TTD", name: "Trinidad and Tobago Dollar" },
    { code: "UZS", name: "Uzbekistani Som" },
    { code: "VEF", name: "Venezuelan Bolívar" },
    { code: "ZMW", name: "Zambian Kwacha" },
    { code: "BND", name: "Brunei Dollar" },
    { code: "FJD", name: "Fijian Dollar" },
    { code: "XAF", name: "Central African CFA Franc" },
    { code: "XOF", name: "West African CFA Franc" },
    { code: "XPF", name: "CFP Franc" },
    { code: "MUR", name: "Mauritian Rupee" },
    { code: "MVR", name: "Maldivian Rufiyaa" },
    { code: "BBD", name: "Barbadian Dollar" },
    { code: "XCD", name: "East Caribbean Dollar" },
    { code: "AWG", name: "Aruban Florin" },
    { code: "PAB", name: "Panamanian Balboa" },
    { code: "BMD", name: "Bermudian Dollar" },
    { code: "KYD", name: "Cayman Islands Dollar" },
    { code: "NPR", name: "Nepalese Rupee" },
    { code: "MMK", name: "Myanmar Kyat" },
    { code: "MNT", name: "Mongolian Tugrik" },
    { code: "LAK", name: "Laotian Kip" },
    { code: "KHR", name: "Cambodian Riel" },
    { code: "MOP", name: "Macanese Pataca" },
    { code: "ETB", name: "Ethiopian Birr" },
    { code: "AMD", name: "Armenian Dram" },
    { code: "SYP", name: "Syrian Pound" },
    { code: "IQD", name: "Iraqi Dinar" },
    { code: "IRR", name: "Iranian Rial" },
    { code: "LBP", name: "Lebanese Pound" },
    { code: "LYD", name: "Libyan Dinar" },
    { code: "SDG", name: "Sudanese Pound" },
    { code: "YER", name: "Yemeni Rial" },
    { code: "AOA", name: "Angolan Kwanza" },
    { code: "RWF", name: "Rwandan Franc" },
    { code: "BIF", name: "Burundian Franc" },
    { code: "SLL", name: "Sierra Leonean Leone" },
    { code: "SOS", name: "Somali Shilling" },
    { code: "ERN", name: "Eritrean Nakfa" },
    { code: "SZL", name: "Swazi Lilangeni" },
    { code: "LSL", name: "Lesotho Loti" },
    { code: "MWK", name: "Malawian Kwacha" },
    { code: "MZN", name: "Mozambican Metical" },
    { code: "SCR", name: "Seychellois Rupee" },
    { code: "CVE", name: "Cape Verdean Escudo" },
    { code: "GMD", name: "Gambian Dalasi" },
    { code: "GNF", name: "Guinean Franc" },
    { code: "MGA", name: "Malagasy Ariary" },
    { code: "STD", name: "São Tomé and Príncipe Dobra" },
    { code: "BTN", name: "Bhutanese Ngultrum" },
    { code: "WST", name: "Samoan Tala" },
    { code: "TOP", name: "Tongan Paʻanga" },
    { code: "SBD", name: "Solomon Islands Dollar" },
    { code: "VUV", name: "Vanuatu Vatu" },
    { code: "PGK", name: "Papua New Guinean Kina" },
  ]

  useEffect(() => {
    convertCurrency()
  }, [amount, fromCurrency, toCurrency])

  const convertCurrency = () => {
    const amountValue = Number.parseFloat(amount)

    if (isNaN(amountValue) || amountValue < 0) {
      setResult(null)
      return
    }

    // Convert to USD first (as base currency), then to target currency
    const amountInUSD = amountValue / exchangeRates[fromCurrency]
    const convertedAmount = amountInUSD * exchangeRates[toCurrency]

    setResult(convertedAmount)
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Filter currencies based on search
  const filteredFromCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchFrom.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchFrom.toLowerCase()),
  )

  const filteredToCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchTo.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTo.toLowerCase()),
  )

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Currency Converter</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
          <div>
            <Label htmlFor="from-currency">From</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger id="from-currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Search currencies..."
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredFromCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" size="icon" onClick={swapCurrencies} className="mb-0.5">
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <div>
            <Label htmlFor="to-currency">To</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger id="to-currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Search currencies..."
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredToCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>

        {result !== null && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {Number.parseFloat(amount).toLocaleString()} {fromCurrency} =
            </p>
            <p className="text-2xl font-bold">
              {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
