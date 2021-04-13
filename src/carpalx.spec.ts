import {
  baseEffortKey,
  fingerAltStrokeEffort,
  handAltStrokeEffort,
  penaltyEffortKey,
  penaltyFinger,
  penaltyHand,
  penaltyRow,
  rowAltStrokeEffort,
  strokeEffort,
} from "./carpalx";

describe("baseEffortKey", () => {
  describe("pattachote", () => {
    it("returns 0,2 for home row keys", () => {
      expect(baseEffortKey("้")).toEqual(0);
      expect(baseEffortKey("ท")).toEqual(0);
      expect(baseEffortKey("ง")).toEqual(0);
      expect(baseEffortKey("ก")).toEqual(0);
      expect(baseEffortKey("ั")).toEqual(2);
      expect(baseEffortKey("ี")).toEqual(2);
      expect(baseEffortKey("า")).toEqual(0);
      expect(baseEffortKey("น")).toEqual(0);
      expect(baseEffortKey("เ")).toEqual(0);
      expect(baseEffortKey("ไ")).toEqual(0);
      expect(baseEffortKey("ข")).toEqual(2);
    });

    it("returns [2, 2, 2, 2, 2.5, 3, 2, 2, 2, 2, 2.5, 4, 6] on upper row keys", () => {
      const efforts = "็ตยอร่ดมวแใฌฃ".split("").map((k) => baseEffortKey(k));

      expect(efforts).toEqual([2, 2, 2, 2, 2.5, 3, 2, 2, 2, 2, 2.5, 4, 6]);
    });

    it("returns [2, 2, 2, 2, 3.5, 2, 2, 2, 2, 2], on lower row keys", () => {
      const efforts = "บปลหิคสะจพ".split("").map((k) => baseEffortKey(k));

      expect(efforts).toEqual([2, 2, 2, 2, 3.5, 2, 2, 2, 2, 2]);
    });

    it("returns [4, 4, 4, 4, 5, 6, 4, 4, 4, 4, 5, 6, 7], on number row keys", () => {
      const efforts = "1๒๓๔๕ู๗๘๙๐๑๖".split("").map((k) => baseEffortKey(k));

      expect(efforts).toEqual([4, 4, 4, 4, 5, 6, 4, 4, 4, 4, 5, 6]);
    });

    it("falls back to 6 if not found", () => {
      expect(baseEffortKey("a")).toEqual(6);
      expect(baseEffortKey("0")).toEqual(6);
    });

    it("raises error if char is longer than 1", () => {
      expect(() => baseEffortKey("อะ")).toThrow();
    });
  });
});

describe("penaltyEffortKey", () => {
  describe("pattachote", () => {
    it("returns [1, 0.5, 0, 0, 0, 0, 0.5, 1] * wf for at home row", () => {
      expect(penaltyFinger("้")).toEqual(1);
      expect(penaltyFinger("ท")).toEqual(0.5);
      expect(penaltyFinger("ง")).toEqual(0);
      expect(penaltyFinger("ก")).toEqual(0);
      expect(penaltyFinger("ั")).toEqual(0);
      expect(penaltyFinger("ี")).toEqual(0);
      expect(penaltyFinger("า")).toEqual(0);
      expect(penaltyFinger("น")).toEqual(0);
      expect(penaltyFinger("เ")).toEqual(0.5);
      expect(penaltyFinger("ไ")).toEqual(1);
      expect(penaltyFinger("ข")).toEqual(1);
    });

    it("returns with row penalty of [0.5, 0, 1]", () => {
      expect(penaltyRow("ก")).toEqual(0);
      expect(penaltyRow("ห")).toEqual(1);
    });

    it("returns with hand penalty of [0.2,0]", () => {
      expect(penaltyHand("ก")).toEqual(0.2);
      expect(penaltyHand("า")).toEqual(0);
    });

    it("returns full weighted value correctly", () => {
      const wf = 2.5948;
      const wr = 1.3088;
      const wh = 1;

      expect(penaltyEffortKey("บ")).toEqual(wf * 1 + wr * 1 + wh * 0.2);
      expect(penaltyEffortKey("ว")).toEqual(wf * 0.5 + wr * 0.5 + wh * 0);
    });
  });
});

describe("strokeEffort", () => {
  it("ultimately returns 0 for งาน, ทาน", () => {
    expect(strokeEffort("งาน")).toEqual(0);
    expect(strokeEffort("ทาน")).toEqual(0);
  });

  describe("handAltStrokeEffort", () => {
    it("returns 0 for triads which use both of hand, without alternating back", () => {
      expect(handAltStrokeEffort("ยาว")).toEqual(0);
      expect(handAltStrokeEffort("ไทย")).toEqual(0);
    });

    it("returns 1 for triads which use both of hand, with alternating back", () => {
      expect(handAltStrokeEffort("กาง")).toEqual(1);
      expect(handAltStrokeEffort("จอด")).toEqual(1);
    });

    it("returns 2 for triads which use only one hand", () => {
      expect(handAltStrokeEffort("กลบ")).toEqual(2);
      expect(handAltStrokeEffort("ดาว")).toEqual(2);
    });
  });

  describe("rowAltStrokeEffort", () => {
    it("returns 0 for triads which use same row", () => {
      expect(rowAltStrokeEffort("กาง")).toEqual(0);
      expect(rowAltStrokeEffort("ตอม")).toEqual(0);
      expect(rowAltStrokeEffort("หลบ")).toEqual(0);
    });

    it("returns 1 for triads which use downward progression row, with repetition", () => {
      expect(rowAltStrokeEffort("ตอน")).toEqual(1);
      expect(rowAltStrokeEffort("แมง")).toEqual(1);
      expect(rowAltStrokeEffort("เกจ")).toEqual(1);
    });

    it("returns 2 for triads which use upward progression row, with repetition", () => {
      expect(rowAltStrokeEffort("ลาน")).toEqual(2);
      expect(rowAltStrokeEffort("งวด")).toEqual(2);
      expect(rowAltStrokeEffort("จอย")).toEqual(2);
    });

    it("returns 3 for triads which have some different row, not monotonic, max row change 1", () => {
      expect(rowAltStrokeEffort("เอก")).toEqual(3);
      expect(rowAltStrokeEffort("มาย")).toEqual(3);
      expect(rowAltStrokeEffort("เบา")).toEqual(3);
    });

    it("returns 4 for triads which use downward progression row, without repetition", () => {
      expect(rowAltStrokeEffort("วาบ")).toEqual(4);
      expect(rowAltStrokeEffort("ตาล")).toEqual(4);
      expect(rowAltStrokeEffort("วีล")).toEqual(4);
    });

    it("returns 5 for triads which have some different, not monotonic, max row change downward >1", () => {
      expect(rowAltStrokeEffort("เวบ")).toEqual(5);
      expect(rowAltStrokeEffort("กอบ")).toEqual(5);
      expect(rowAltStrokeEffort("ทอส")).toEqual(5);
      expect(rowAltStrokeEffort("อลั")).toEqual(5);
    });

    it("returns 6 for triads which use upward progression row, without repetition", () => {
      expect(rowAltStrokeEffort("บ้อ")).toEqual(6);
      expect(rowAltStrokeEffort("พาย")).toEqual(6);
      expect(rowAltStrokeEffort("ลาว")).toEqual(6);
    });

    it("returns 7 for triads which have some different, not monotonic, max row change upward >1", () => {
      expect(rowAltStrokeEffort("กลอ")).toEqual(7);
      expect(rowAltStrokeEffort("ทลว")).toEqual(7);
      expect(rowAltStrokeEffort("ไพร")).toEqual(7);
      expect(rowAltStrokeEffort("ครั")).toEqual(7);
    });
  });

  describe("fingerAltStrokeEffort", () => {
    it("returns 0 for triads which use all different, monotonic progression", () => {
      expect(fingerAltStrokeEffort("ทอน")).toEqual(0);
      expect(fingerAltStrokeEffort("บอด")).toEqual(0);
      expect(fingerAltStrokeEffort("ลอา")).toEqual(0);
    });

    it("returns 1 for triads which use some different, key repeat, monotonic progression", () => {
      expect(fingerAltStrokeEffort("แดด")).toEqual(1);
      expect(fingerAltStrokeEffort("เกก")).toEqual(1);
      expect(fingerAltStrokeEffort("แบบ")).toEqual(1);
    });

    it("returns 2 for triads which use rolling-in fingers", () => {
      expect(fingerAltStrokeEffort("เท่")).toEqual(2);
      expect(fingerAltStrokeEffort("ขัน")).toEqual(2);
      expect(fingerAltStrokeEffort("เบา")).toEqual(2);
      expect(fingerAltStrokeEffort("เอา")).toEqual(2);
    });

    it("returns 3 for triads which use all different fingers, not monotonic", () => {
      expect(fingerAltStrokeEffort("ท้า")).toEqual(3);
      expect(fingerAltStrokeEffort("เข้")).toEqual(3);
      expect(fingerAltStrokeEffort("อ้น")).toEqual(3);
    });

    it("returns 4 for triads which use some different fingers, not monotonic progression", () => {
      expect(fingerAltStrokeEffort("สกา")).toEqual(4);
      expect(fingerAltStrokeEffort("เลว")).toEqual(4);
      expect(fingerAltStrokeEffort("ดอด")).toEqual(4);
    });

    it("returns 5 for triads which use same finger, key repeat", () => {
      expect(fingerAltStrokeEffort("ออก")).toEqual(5);
      expect(fingerAltStrokeEffort("ววจ")).toEqual(5);
      expect(fingerAltStrokeEffort("ปทท")).toEqual(5);
    });

    it("returns 6 for triads which use some different fingers, no key repeat, monotonic progression", () => {
      expect(fingerAltStrokeEffort("แอก")).toEqual(6);
      expect(fingerAltStrokeEffort("ไลย")).toEqual(6);
      expect(fingerAltStrokeEffort("เบ็")).toEqual(6);
    });

    it("returns 7 for triads which same finger, no key repeat", () => {
      expect(fingerAltStrokeEffort("ริก")).toEqual(7);
      expect(fingerAltStrokeEffort("สาด")).toEqual(7);
      expect(fingerAltStrokeEffort("หอก")).toEqual(7);
    });
  });
});
