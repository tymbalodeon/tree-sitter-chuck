import XCTest
import SwiftTreeSitter
import TreeSitterChuck

final class TreeSitterChuckTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_chuck())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Chuck grammar")
    }
}
